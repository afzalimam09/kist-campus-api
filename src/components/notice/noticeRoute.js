import { Router } from "express";
import { protect } from "../faculty/facultyController.js";
import {
    deleteNotice,
    editNotice,
    getAllNotice,
    getSingleNotice,
    uploadNotice,
} from "./noticeController.js";

const router = Router();

router.get("/", getAllNotice);

router.get("/:noticeId", getSingleNotice);

router.use(protect);

router.post("/upload", uploadNotice);

router.patch("/edit/:noticeId", editNotice);

router.delete("/delete/:noticeId", deleteNotice);

export default router;
