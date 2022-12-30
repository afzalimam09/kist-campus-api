import { Router } from "express";
import { protect, restrictToAdmin } from "../auth/authController.js";
import {
    deleteNotification,
    editNotification,
    getAllNotification,
    getSingleNotification,
    uploadNotification,
} from "./notificationController.js";

const router = Router();

router.use(protect);
router.get("/", getAllNotification);
router.get("/:id", getSingleNotification);
router.delete("/:id", deleteNotification);

//restrict to admin
router.use(restrictToAdmin);
router.post("/", uploadNotification);
router.patch("/:id", editNotification);

export default router;
