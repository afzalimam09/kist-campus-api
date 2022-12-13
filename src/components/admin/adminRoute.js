import { Router } from "express";
import {
    getAllFaculties,
    getAllNotices,
    getAllStudents,
} from "./adminController.js";

const router = Router();

router.get("/all-students", getAllStudents);
router.get("/all-faculties", getAllFaculties);
router.get("/all-notices", getAllNotices);

export default router;
