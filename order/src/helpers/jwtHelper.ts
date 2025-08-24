import jwt, { JwtPayload } from "jsonwebtoken";
import ApiError from "../middlewares/error";
import { HttpStatusCode } from "../lib/httpStatus";
import { IJWtPayload } from "../interfaces/common.interface";
import { envConfig } from "../config";

class JwtHelper {
  static createToken(payload: object, expireTime: any): string {
    return jwt.sign(payload, envConfig.jwt.secret, {
      expiresIn: expireTime,
    });
  }

  static async generateTokens(
    data: IJWtPayload
  ): Promise<{ access_token: string; refresh_token: string }> {
    const access_token = this.createToken(
      data,
      envConfig.jwt.access_token_expires
    );
    const refresh_token = this.createToken(
      data,
      envConfig.jwt.refresh_token_expires
    );

    return { access_token, refresh_token };
  }

  static verifyToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, envConfig.jwt.secret) as JwtPayload;
    } catch (error: any) {
      if (error?.name === "TokenExpiredError") {
        throw new ApiError(
          HttpStatusCode.UNAUTHORIZED,
          "Your session has expired. Please log in again to continue."
        );
      } else if (error?.name === "JsonWebTokenError") {
        throw new ApiError(
          HttpStatusCode.UNAUTHORIZED,
          "Invalid token. Authentication failed."
        );
      } else if (error?.name === "NotBeforeError") {
        throw new ApiError(
          HttpStatusCode.UNAUTHORIZED,
          "Token is not active yet. Please wait before retrying."
        );
      } else {
        throw new ApiError(
          HttpStatusCode.INTERNAL_SERVER_ERROR,
          "An unexpected error occurred while verifying authentication."
        );
      }
    }
  }
}

export default JwtHelper;
