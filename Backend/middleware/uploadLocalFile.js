import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

// Multer + Cloudinary storage setup
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "BastaStorage/LocalFiles",
    resource_type: "auto",
    use_filename: true,
    unique_filename: false,
    overwrite: true,
    public_id: file.originalname.split(".")[0]
  }),
});

export const upload = multer({ storage });


