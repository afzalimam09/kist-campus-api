import catchAsync from "../../helper/catchAsync.js";
import User from "../../models/userModel.js";
import dateFormat from "dateformat";
import { sendEmailToMultiple } from "../../utils/sendGrid.js";

const messageData = (emails, notice) => {
    return {
        to: emails,
        from: "KIST Collge <contact@fixxgroup.in>",
        subject: "New Notice Released on KIST College Notice Board",
        text: "New Notice Released on KIST College Notice Board",
        html: `
            <main
            style="
                margin: 0 auto;
                width: 100%;
                max-width: 700px;
                line-height: 1.5;
                padding: 0;
            "
        >
            <div
                style="
                    background-color: #017ed0;
                    color: #fff;
                    padding: 25px;
                    text-align: center;
                    border-top-left-radius: 10px;
                    border-top-right-radius: 10px;
                "
            >
                <h1 style="margin-bottom: 20px">KIST College</h1>
                <h2>New Notice Released by the KIST Collge</h2>
            </div>
            <div
                style="
                    padding: 50px 25px;
                    color: #444444;
                    background-color: #fff;
                    padding-top: 25px;
                    border-left: 1px solid gray;
                    border-right: 1px solid gray;
                "
            >
                <p style="color: #444444; font-size: 17px">
                    We got a new notice for you released by KIST College
                </p>
                <p style="color: #444444; font-size: 17px">
                    <strong>Title: </strong> ${notice.title}
                </p>
                <p style="color: #444444; font-size: 17px"><strong>Date: </strong> ${dateFormat(
                    notice.createdAt,
                    "mmm d, yyyy"
                )}</p>
                <p style="color: #444444; font-size: 17px">
                    <strong>Ref Id: </strong> ${notice.refId}
                </p>
                <p style="color: #444444; font-size: 17px; margin-bottom: 10px">
                    <strong>Description: </strong> ${notice.description}
                </p>
                <div style="text-align: center; margin-top: 40px">
                    <a
                        style="
                            text-decoration: none;
                            padding: 15px 44px;
                            background-color: #272362;
                            color: white;
                            font-weight: 600;
                            border: none;
                            border-radius: 10px;
                        "
                        href="https://kistcollege.netlify.app/notice/${
                            notice._id
                        }"
                        >Click Here to View</a
                    >
                </div>
            </div>
            <div
                style="
                    padding: 40px 0;
                    text-align: center;
                    background-color: #272362;
                    font-weight: 300;
                    font-size: 14px;
                    color: #fff;
                    padding-bottom: 20px;
                    border-bottom-left-radius: 10px;
                    border-bottom-right-radius: 10px;
                "
            >
                <div style="margin-bottom: 30px">
                    <a href="" style="margin: 0 10px">
                        <img
                            style="width: 44px; height: 44px"
                            src="https://res.cloudinary.com/afzalimamcloud/image/upload/v1672747072/logos/ckhvkgqwjegoary4bcl4.png"
                        />
                    </a>
                    <a href="" style="margin: 0 10px">
                        <img
                            style="width: 44px; height: 44px"
                            src="https://res.cloudinary.com/afzalimamcloud/image/upload/v1672747073/logos/jk5up0bhvnova1zvzk7p.png"
                        />
                    </a>
                    <a href="" style="margin: 0 10px">
                        <img
                            style="width: 44px; height: 44px"
                            src="https://res.cloudinary.com/afzalimamcloud/image/upload/v1672747072/logos/veflcg6ghxiansjzmx7b.png"
                        />
                    </a>
                </div>
                <div style="margin-bottom: 20px; font-size: 14px">
                    <p style="color: 'white">EMAIL: contact@kist.ac.in</p>
                    <p>Techno Park, Jatni</p>
                    <p>Bhubaneshwar, Odisha - 752050</p>
                </div>
                <p style="border-top: 1px solid #b8b8b8; padding-top: 15px">
                    &#169; KIST College | All Rights Reserved
                </p>
            </div>
        </main>
        `,
    };
};

export const sendNoticeEmail = catchAsync(async (req, res, next) => {
    console.log("from notice email");
    const notice = req.body;
    const activeUsers = await User.find({ status: "Active" });
    const activeUsersEmail = activeUsers.map((user) => user.email);
    await sendEmailToMultiple(messageData(activeUsersEmail, notice));
    res.json({ status: "success" });
});
