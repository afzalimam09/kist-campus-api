import { Router } from "express";
import {
    protect,
    restrictToAdmin,
    updatePassword,
    uploadUserImage,
} from "../auth/authController.js";
import {
    addUser,
    deleteUser,
    getAllUsers,
    getMe,
    getUser,
    updateMe,
    updateUser,
} from "./userController.js";

const router = Router();

router.use(protect);
router.patch("/update-my-password", updatePassword);
router.get("/me", getMe, getUser);
router.patch("/update-me", uploadUserImage, updateMe);

//Access to admins only
router.use(restrictToAdmin);
router.route("/").get(getAllUsers).post(addUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export default router;
