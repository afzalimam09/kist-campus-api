import AppError from "../../helper/appError.js";
import catchAsync from "../../helper/catchAsync.js";
import Notice from "../../models/noticeModel.js";
import { APIFeatures } from "../../utils/apiFeatures.js";

export const uploadNotice = catchAsync(async (req, res, next) => {
    const addedBy = req.user.id;
    const newNotice = await Notice.create({ addedBy, ...req.body });
    res.status(201).json({
        status: "success",
        data: {
            newNotice,
        },
    });
});

export const getAllNotice = catchAsync(async (req, res, next) => {
    const length = await Notice.countDocuments();
    const features = new APIFeatures(Notice.find(), req.query)
        .sort()
        .paginate();
    const doc = await features.query;
    res.status(200).json({
        status: "success",
        length,
        doc,
    });
});

export const getSingleNotice = catchAsync(async (req, res, next) => {
    const notice = await Notice.findById(req.params.noticeId);
    res.status(200).json({
        status: "success",
        data: {
            notice,
        },
    });
});

export const editNotice = catchAsync(async (req, res, next) => {
    const notice = await Notice.findByIdAndUpdate(
        req.params.noticeId,
        req.body,
        {
            new: true,
        }
    );
    if (!notice) {
        return next(new AppError("No notice found with given id!", 400));
    }
    res.status(200).json({
        status: "success",
        data: {
            notice,
        },
    });
});

export const deleteNotice = catchAsync(async (req, res, next) => {
    const notice = await Notice.findByIdAndDelete(req.params.noticeId);
    if (!notice) {
        return next(new AppError("No notice found with given id!", 400));
    }
    res.status(204).json({
        status: "success",
        data: {
            notice,
        },
    });
});
