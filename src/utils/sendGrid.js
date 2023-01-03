import sendGridMail from "@sendgrid/mail";
import config from "../core/config.js";
sendGridMail.setApiKey(config.sendgrid.api_key);

export const sendEmailToMultiple = async (msgData) => {
    try {
        await sendGridMail.sendMultiple(msgData);
        console.log("Test email sent successfully");
    } catch (error) {
        console.error("Error sending test email");
        console.error(error);
        if (error.response) {
            console.error(error.response.body);
        }
    }
};
