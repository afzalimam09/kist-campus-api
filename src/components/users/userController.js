import User from "../../models/userModel.js";
import { deleteOne, getAll, getOne, updateOne } from "../handleFactory.js";

export const addUser = (req, res, next) => {
    res.status(500).json({
        status: "error",
        message: "This route is not defined! Please use signup instead!",
    });
};

export const getAlUsers = getAll(User);
export const getUser = getOne(User);
export const updateUser = updateOne(User);
export const deleteUser = deleteOne(User);
