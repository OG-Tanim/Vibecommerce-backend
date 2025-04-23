import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary';

const fileFilter = (allowedTypes: string[]) => {
  return (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (allowedTypes.includes(file.mimetype)) {               //mimetype is file's content type that is sent in metadata of the uploaded file
      cb(null, true);                                         //callback, called with true/null to accept the file or error to reject
    } else {
      cb(new Error(`File type not allowed: ${file.mimetype}`));
    }
  };
};

const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, res) => {
    return {
    folder: 'ecommerce-products',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    resource_type: 'image',
    }
  },
});

const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, res) => {
    return {folder: 'ecommerce-videos',
    allowed_formats: ['mp4'],
    resource_type: 'video',
    }
  },
});

export const imageUpload = multer({
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter(['image/jpeg', 'image/png', 'image/jpg']), //file types in MIME format
});

export const videoUpload = multer({
  storage: videoStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: fileFilter(['video/mp4']),
});

