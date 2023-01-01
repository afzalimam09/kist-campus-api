import dotenv from "dotenv-safe";

dotenv.config();

export default {
    db: {
        str: process.env.DB_URL,
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
    },
    cloudinary: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_NAME,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    },
};
