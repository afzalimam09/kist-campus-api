import { Router } from "express";
import { protect, restrictToAdmin } from "../auth/authController.js";
import {
    deleteNotice,
    editNotice,
    getAllNotice,
    getSingleNotice,
    uploadNotice,
    uploadNoticeImg,
} from "./noticeController.js";

const router = Router();

router.get("/", getAllNotice);

router.get("/:id", getSingleNotice);

//restrict to admin
router.use(protect, restrictToAdmin);
router.post("/", uploadNoticeImg, uploadNotice);
router.patch("/:id", uploadNoticeImg, editNotice);
router.delete("/:id", deleteNotice);

export default router;
