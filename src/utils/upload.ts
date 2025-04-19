import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import cloudinary from './cloudinary'

const imageStorage = new CloudinaryStorage({
    cloudinary,
    params:async (req, file) => {
        return {
            folder: 'ecommerce-products',
            allowed_formats: ['jpg', 'png'],
            resource_type: 'image',
        } 
        //params being defined as a function that returns similar config as 'params in multer-storage-cloudinary' because ts throws type error on params as upload options 
    },
});

const VideoStorage = new CloudinaryStorage({
    cloudinary, 
    params: async (req, file) => {
        return { 
            folder: 'ecommerce-videos',
            allowedFormats: ['mp4'],
            resource_type: 'video'
        }
    }
})

export const imageUpload = multer({ storage: imageStorage })
export const videoUpload = multer({ storage: VideoStorage })