import mongoose from "mongoose";
import validator from "validator";
const { isEmail } = validator;
import bcryptjs from "bcryptjs";
const { hash, compare } = bcryptjs;

import db from "../connections/dbConnection.js";

const Schema = mongoose.Schema;

//Creating User Schema
const facultySchema = new Schema({
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
    gender: {
        type: String,
        enum: ["male", "female"],
        required: [true, "Please provide your gender!"],
    },
    mobile: {
        type: Number,
        required: [true, "Please provide your mobile number!"],
    },
    regNo: {
        type: Number,
        required: [true, "Please provide your reg. no!"],
    },
    department: {
        type: String,
        required: [true, "Please provide your branch!"],
    },
    password: {
        type: String,
        required: [true, "Please provide a password!"],
        minlength: 8,
        select: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
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
    active: {
        type: Boolean,
        default: true,
        select: false,
    },
});

// This middleware will run before saving the data to the database
facultySchema.pre("save", async function (next) {
    // if password is not modified then skip encryption and continue with rest of the code
    if (!this.isModified("password")) return next();

    // Encrypt and and stare the password
    this.password = await hash(this.password, 12);

    // Set the confirm password to undefined because we no longer need this
    this.passwordConfirm = undefined;

    next();
});

facultySchema.pre("save", function (next) {
    if (!this.isModified("password") || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;

    next();
});

// To select only active users
facultySchema.pre(/^find/, function (next) {
    // this points to the current query
    this.find({ active: { $ne: false } });
    next();
});

// Create instance method that will check password is correct or not
facultySchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await compare(candidatePassword, userPassword);
};

// Instance method the check if user has changed password after token was issued
facultySchema.methods.changedPasswordAfter = function (JWTTimestamp) {
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

const Faculty = db.model("Faculty", facultySchema);

export default Faculty;
