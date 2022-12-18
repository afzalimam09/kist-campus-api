import Notice from "../../models/noticeModel.js";
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
