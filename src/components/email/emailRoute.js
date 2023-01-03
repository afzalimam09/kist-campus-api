import { Router } from "express";
import { protect, restrictToAdmin } from "../auth/authController.js";
import { sendNoticeEmail } from "./emailController.js";

const router = Router();

router.use(protect, restrictToAdmin);
router.post("/send-notice-email", sendNoticeEmail);

export default router;
