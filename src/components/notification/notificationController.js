import Notification from "../../models/notificationModel.js";
import {
    createOne,
    deleteOne,
    getAll,
    getOne,
    updateOne,
} from "../handleFactory.js";

export const getAllNotification = getAll(Notification);
export const getSingleNotification = getOne(Notification);
export const editNotification = updateOne(Notification);
export const deleteNotification = deleteOne(Notification);
export const uploadNotification = createOne(Notification);
