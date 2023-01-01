import { promisify } from "util";
import jsonwebtoken from "jsonwebtoken";
const { sign, verify } = jsonwebtoken;

import User from "../../models/userModel.js";
import AppError from "../../helper/appError.js";
import catchAsync from "../../helper/catchAsync.js";
import Notification from "../../models/notificationModel.js";
import { cloudinary } from "../../utils/cloudinary.js";

const signToken = (id) => {
    return sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const createSendToken = (user, statusCode, req, res) => {
    const token = signToken(user._id);

    res.cookie("jwt", token, {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: req.secure || req.headers["x-forwarded-proto"] === "https",
    });

    // Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        status: "success",
        token,
        data: user,
    });
};

export const signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create(req.body);
    const notification = {
        userId: newUser._id,
        content:
            "You have regestered successfully. But your account status is pending. You can wait for the account verification by Admin. Otherwise contact your admin!",
    };
    await Notification.create(notification);
    res.status(201).json({
        status: "success",
        message:
            "You are signed up. Please use /api/v1/student/signin to sign in",
        data: newUser,
    });
});

export const signin = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    //Check if email and password exists
    if (!email || !password) {
        return next(new AppError("Please provide email and password!", 400));
    }

    //Check if user exist and password is correct
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError("Incorrect email or password!", 401));
    }

    // If everything is okay, then send token to client
    createSendToken(user, 200, req, res);
});

// Logout the user by sending cookie without token
export function logout(req, res) {
    res.cookie("jwt", "", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });

    res.status(200).json({
        status: "success",
    });
}

export const protect = catchAsync(async (req, res, next) => {
    let token;

    // 1) Get the token and check it's there
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {
        return next(
            new AppError(
                "You are not logged in, please login to get access",
                401
            )
        ); //401 - Unauthorized
    }

    // 2) Varification of token

    const decoded = await promisify(verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(
            new AppError(
                "The user belongs to this token does no longer exist.",
                401
            )
        );
    }

    // 4) check if user has changed the password after token was issued

    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(
            new AppError("Recently changed the password, Login again", 401)
        );
    }

    // Grant access to the prodected rout
    req.user = currentUser;
    res.locals.user = currentUser;

    next();
});

export const restrictToAdmin = (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(
            new AppError(
                "You do not have permission to perform this action",
                403
            )
        );
    }
    next();
};

export const updatePassword = catchAsync(async (req, res, next) => {
    // 1) Get user from collection
    const user = await User.findById(req.user.id).select("+password");

    // 2) Check if POSTed current password is correct
    if (
        !(await user.correctPassword(req.body.passwordCurrent, user.password))
    ) {
        return next(new AppError("Your current password is wrong.", 401));
    }

    // 3) If so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    // User.findByIdAndUpdate will NOT work as intended!

    // 4) Log user in, send JWT
    createSendToken(user, 200, req, res);
});

export const uploadUserImage = catchAsync(async (req, res, next) => {
    const { image, regNo, role } = req.body;
    if (image && regNo && role) {
        const imageTitle = `${role.toLowerCase()}-${regNo}`;
        const uploadRes = await cloudinary.uploader.upload(image, {
            upload_preset: "kist-onb",
            overwrite: true,
            folder: `kist-onb/users/${role.toLowerCase()}`,
            public_id: imageTitle,
            unique_filename: true,
            transformation: [
                { width: 460, height: 500, gravity: "faces", crop: "thumb" },
            ],
        });
        if (uploadRes) {
            req.body.profileImg = uploadRes.secure_url;
            req.body.image = undefined;
            console.log(req.body);
        }
    }
    next();
});
