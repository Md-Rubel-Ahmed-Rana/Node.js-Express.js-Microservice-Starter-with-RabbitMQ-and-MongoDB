import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload | null | any;
      file: Express.Multer.File | undefined;
      files: Express.Multer.File[] | undefined;
    }
  }
}
