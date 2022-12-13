import { Router } from "express";

import studentRoute from "./students/studentRoute.js";
import facultyRoute from "./faculty/facultyRoute.js";
import noticeRoute from "./notice/noticeRoute.js";
import adminRoute from "./admin/adminRoute.js";

const router = Router();

router.use("/student", studentRoute);
router.use("/faculty", facultyRoute);
router.use("/notice", noticeRoute);
router.use("/admin", adminRoute);

export default router;
