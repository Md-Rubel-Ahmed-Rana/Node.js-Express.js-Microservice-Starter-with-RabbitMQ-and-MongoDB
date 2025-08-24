import { HttpStatusCode } from "@/lib/httpStatus";
import ApiError from "@/middlewares/error";
import {
  allowedExtensions,
  allowedImageTypes,
} from "@/utils/allowedImageTypes";
import multer from "multer";
import path from "path";

const MAX_SIZE = 5 * 1024 * 1024;

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_SIZE,
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype;

    if (allowedImageTypes.includes(mime) || allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(
        new ApiError(
          HttpStatusCode.BAD_REQUEST,
          `Only image files are allowed. You provided:'${ext}'. Allowed types: ${allowedImageTypes.join(", ")}`
        )
      );
    }
  },
});
