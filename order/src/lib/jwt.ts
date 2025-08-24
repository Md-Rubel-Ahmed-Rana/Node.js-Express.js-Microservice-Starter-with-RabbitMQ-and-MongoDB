import { NextFunction, Request, Response } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { envConfig } from "../config";
import { IJWtPayload } from "@/interfaces/common.interface";
import ApiError from "@/middlewares/error";
import { HttpStatusCode } from "./httpStatus";
import { cookieManager } from "@/shared/cookie";
import { IRoles } from "@/constants/roles";

class JWT {
  private signToken = async (
    payload: IJWtPayload,
    secret: string,
    expiresIn: string
  ): Promise<string> => {
    return jwt.sign(payload, secret, { expiresIn } as any);
  };

  private generateAccessToken = async (
    payload: IJWtPayload
  ): Promise<string> => {
    return this.signToken(
      payload,
      envConfig.jwt.secret,
      envConfig.jwt.access_token_expires
    );
  };

  private generateRefreshToken = async (
    payload: IJWtPayload
  ): Promise<string> => {
    return this.signToken(
      payload,
      envConfig.jwt.secret,
      envConfig.jwt.refresh_token_expires
    );
  };

  async generateTokens(
    payload: IJWtPayload
  ): Promise<{ access_token: string; refresh_token: string }> {
    const access_token = await this.generateAccessToken(payload);
    const refresh_token = await this.generateRefreshToken(payload);
    return { access_token, refresh_token };
  }

  public authenticate(allowedRoles?: IRoles[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
      const access_token = req?.cookies[envConfig.jwt.access_cookie_name];
      const refresh_token = req?.cookies[envConfig.jwt.refresh_cookie_name];

      if (!access_token || !refresh_token) {
        next(
          new ApiError(
            HttpStatusCode.UNAUTHORIZED,
            "Unauthenticated access. Please login to access resource(s)"
          )
        );
      }

      try {
        const payload = jwt.verify(
          access_token,
          envConfig.jwt.secret
        ) as IJWtPayload;

        if (!payload) {
          next(
            new ApiError(
              HttpStatusCode.UNAUTHORIZED,
              "Invalid authentication token"
            )
          );
        }

        if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
          if (!allowedRoles.includes(payload.role as IRoles)) {
            next(
              new ApiError(HttpStatusCode.FORBIDDEN, "Forbidden: Access denied")
            );
          }
        }
        req.user = payload;
        next();
      } catch (error: any) {
        if (error instanceof TokenExpiredError) {
          return this.handleExpiredAccessToken(refresh_token, res, next);
        }

        if (error?.statusCode === HttpStatusCode.FORBIDDEN) {
          next(
            new ApiError(HttpStatusCode.FORBIDDEN, "Forbidden: Access denied")
          );
        }
        next(
          new ApiError(HttpStatusCode.UNAUTHORIZED, "Authentication failed")
        );
      }
    };
  }

  private handleExpiredAccessToken = async (
    refresh_token: string,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = jwt.verify(
        refresh_token,
        envConfig.jwt.secret
      ) as IJWtPayload;

      const payload: IJWtPayload = {
        id: result.id,
        phone_number: result?.phone_number,
        role: result?.role,
      };
      const { access_token, refresh_token: new_refresh_token } =
        await this.generateTokens(payload);
      cookieManager.setTokens(res, access_token, new_refresh_token);

      next();
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        return this.logoutUser(res);
      }
      throw new ApiError(HttpStatusCode.UNAUTHORIZED, "Unauthenticated access");
    }
  };

  private logoutUser = (res: Response) => {
    cookieManager.clearTokens(res);
    return res.status(HttpStatusCode.OK).json({
      statusCode: HttpStatusCode.OK,
      success: true,
      message: "You have logged out",
      data: null,
    });
  };
}

export const JwtInstance = new JWT();
