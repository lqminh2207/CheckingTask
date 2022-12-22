import slugify from "slugify"
import { v2 as cloudinary } from 'cloudinary'
import { config } from 'dotenv'
const { CloudinaryStorage } = require('multer-storage-cloudinary');
import multer = require('multer')

config()

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY,  
    api_secret: process.env.CLOUD_API_SECRET,
    secure: true
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        return {
            folder: 'member',
            format: 'jpeg', 
            public_id: Date.now() + '-' + Math.floor(Math.random()*(999 - 100 + 1) + 100) + '-' + slugify(file.originalname, { lower: true, strict: true }),
        };
    },
});

const uploadCloud = multer({ storage });

export default uploadCloud