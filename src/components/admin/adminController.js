import catchAsync from "../../helper/catchAsync.js";
import Student from "../../models/studentModel.js";
import Faculty from "../../models/facultyModel.js";
import Notice from "../../models/noticeModel.js";

export const getAllStudents = catchAsync(async (req, res, next) => {
    const students = await Student.find();
    res.status(200).json({
        status: "success",
        students,
    });
});
export const getAllFaculties = catchAsync(async (req, res, next) => {
    const faculties = await Faculty.find();
    res.status(200).json({
        status: "success",
        faculties,
    });
});
export const getAllNotices = catchAsync(async (req, res, next) => {
    const notices = await Notice.find().populate("addedBy");
    console.log(notices);
    res.status(200).json({
        status: "success",
        notices,
    });
});
