import { Router } from "express";
import { logout, signin, signup, uploadUserImage } from "./authController.js";

const router = Router();

// Auth Routes
router.post("/signup", uploadUserImage, signup);
router.post("/signin", signin);
router.get("/logout", logout);

export default router;
