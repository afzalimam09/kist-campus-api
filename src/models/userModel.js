import mongoose from "mongoose";
import validator from "validator";
const { isEmail } = validator;
import bcryptjs from "bcryptjs";
const { hash, compare } = bcryptjs;

import db from "../connections/dbConnection.js";

const Schema = mongoose.Schema;

//Creating User Schema
const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please enter your name!"],
    },
    email: {
        type: String,
        required: [true, "Please provide your email address!"],
        unique: true,
        lowercase: true,
        validate: [isEmail, "Please provide a valid email!"],
    },
    mobile: {
        type: Number,
        required: [true, "Please provide your mobile number!"],
    },
    regNo: {
        type: Number,
        required: [true, "Please provide your reg. no!"],
    },
    gender: {
        type: String,
        enum: ["Male", "Female"],
    },
    course: {
        type: String,
        enum: ["B-Tech", "IMBA", "M-Tech", "MBA"],
    },
    branch: {
        type: String,
    },
    semester: {
        type: String,
        enum: ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"],
    },
    status: {
        type: String,
        enum: ["Active", "Pending", "Blocked"],
        default: "Pending",
    },
    role: {
        type: String,
        enum: ["Student", "Faculty"],
        required: [true, "Role is required!"],
    },
    profileImg: {
        type: String,
        required: [true, "Image is required!"],
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    password: {
        type: String,
        required: [true, "Please provide a password!"],
        minlength: 8,
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, "Please confirm your password!"],
        validate: {
            // This only works on save and create
            validator: function (el) {
                return el === this.password;
            },
            message: "Password must be same!",
        },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
});

// This middleware will run before saving the data to the database
userSchema.pre("save", async function (next) {
    // if password is not modified then skip encryption and continue with rest of the code
    if (!this.isModified("password")) return next();

    // Encrypt and and stare the password
    this.password = await hash(this.password, 12);

    // Set the confirm password to undefined because we no longer need this
    this.passwordConfirm = undefined;

    next();
});

userSchema.pre("save", function (next) {
    if (!this.isModified("password") || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;

    next();
});

// To select only active users
userSchema.pre(/^find/, function (next) {
    // this points to the current query
    this.find({ active: { $ne: false } });
    next();
});

// Create instance method that will check password is correct or not
userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await compare(candidatePassword, userPassword);
};

// Instance method the check if user has changed password after token was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimeStamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );
        // console.log(changedTimeStamp, JWTTimestamp);

        return JWTTimestamp < changedTimeStamp;
    }

    // False means password not changed
    return false;
};

//Create Model out of Schema

const User = db.model("User", userSchema);

export default User;
