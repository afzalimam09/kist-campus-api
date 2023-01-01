import catchAsync from "../../helper/catchAsync.js";
import Notice from "../../models/noticeModel.js";
import { cloudinary } from "../../utils/cloudinary.js";
import {
    createOne,
    deleteOne,
    getAll,
    getOne,
    updateOne,
} from "../handleFactory.js";

export const getAllNotice = getAll(Notice);
export const getSingleNotice = getOne(Notice);
export const editNotice = updateOne(Notice);
export const deleteNotice = deleteOne(Notice);
export const uploadNotice = createOne(Notice);

export const uploadNoticeImg = catchAsync(async (req, res, next) => {
    const { image, refId } = req.body;
    if (image && refId) {
        const imageTitle = refId.split("/").join("-").toLowerCase();
        const uploadRes = await cloudinary.uploader.upload(image, {
            upload_preset: "kist-onb",
            folder: "kist-onb/notices",
            overwrite: true,
            public_id: imageTitle,
            unique_filename: true,
        });
        if (uploadRes) {
            req.body.imageUrl = uploadRes.secure_url;
            req.body.image = undefined;
        }
    }
    next();
});
