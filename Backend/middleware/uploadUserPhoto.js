import multer from "multer";
import path from "path";
import crypto from "crypto";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./upload");  // sirf directory
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    const randomId = crypto.randomUUID();
    const fullName = `${randomId}${extension}`;
    cb(null, fullName);
  }
});

export const upload = multer({ storage });
 