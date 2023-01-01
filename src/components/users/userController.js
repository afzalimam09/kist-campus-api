import catchAsync from "../../helper/catchAsync.js";
import User from "../../models/userModel.js";
import { deleteOne, getAll, getOne, updateOne } from "../handleFactory.js";

export const addUser = (req, res, next) => {
    res.status(500).json({
        status: "error",
        message: "This route is not defined! Please use signup instead!",
    });
};

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

export const getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};

export const updateMe = catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError(
                "This route is not for password updates. Please use /update-my-password.",
                400
            )
        );
    }
    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(
        req.body,
        "name",
        "email",
        "mobile",
        "gender",
        "regNo",
        "course",
        "branch",
        "semester",
        "role",
        "profileImg"
    );

    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        filteredBody,
        {
            new: true,
            runValidators: true,
        }
    );

    res.status(200).json({
        status: "success",
        data: updatedUser,
    });
});

export const getAllUsers = getAll(User);
export const getUser = getOne(User);
export const updateUser = updateOne(User);
export const deleteUser = deleteOne(User);
