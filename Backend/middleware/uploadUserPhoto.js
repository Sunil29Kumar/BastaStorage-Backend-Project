// ----- cloudinary setup 

import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'BastaStorage/UserPhotos',
    resource_type: 'auto', 
  },
});

export const upload = multer({ storage });


