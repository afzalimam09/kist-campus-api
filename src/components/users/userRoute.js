import { Router } from "express";
import { protect, restrictToAdmin } from "../auth/authController.js";
import {
    addUser,
    deleteUser,
    getAlUsers,
    getUser,
    updateUser,
} from "./userController.js";

const router = Router();

router.use(protect);
//For user it self : protected routes

//Access to admins only
router.use(restrictToAdmin);
router.route("/").get(getAlUsers).post(addUser);

router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export default router;
