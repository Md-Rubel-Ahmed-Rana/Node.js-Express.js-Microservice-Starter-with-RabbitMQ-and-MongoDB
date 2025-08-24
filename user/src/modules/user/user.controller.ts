import BaseController from "@/shared/baseController";
import { Request, Response } from "express";
import { UserService } from "./user.service";
import { HttpStatusCode } from "@/lib/httpStatus";
import { cookieManager } from "@/shared/cookie";

class Controller extends BaseController {
  create = this.catchAsync(async (req: Request, res: Response) => {
    await UserService.create(req.body);
    this.sendResponse(res, {
      statusCode: HttpStatusCode.CREATED,
      success: true,
      message:
        "Your account has been created successfully. We've sent a verification code (SMS) to you phone number. Please verify to access your account",
    });
  });

  login = this.catchAsync(async (req: Request, res: Response) => {
    const { access_token, refresh_token, user } = await UserService.login(
      req.body
    );
    // store tokens on cookie
    cookieManager.setTokens(res, access_token, refresh_token);

    this.sendResponse(res, {
      statusCode: HttpStatusCode.OK,
      success: true,
      message: "You've logged in successfully",
      data: user,
    });
  });

  getLoggedInUser = this.catchAsync(async (req: Request, res: Response) => {
    const user = await UserService.getLoggedInUser(req?.user?.id);
    this.sendResponse(res, {
      statusCode: HttpStatusCode.OK,
      success: true,
      message: "Authenticated user retrieved successfully",
      data: user,
    });
  });

  resetPassword = this.catchAsync(async (req: Request, res: Response) => {
    await UserService.resetPassword(req.body);
    this.sendResponse(res, {
      statusCode: HttpStatusCode.OK,
      success: true,
      message:
        "Your password has been reset successfully. Please login to your account",
      data: null,
    });
  });

  changePassword = this.catchAsync(async (req: Request, res: Response) => {
    await UserService.changePassword(req?.user?.id, req.body);
    cookieManager.clearTokens(res);
    this.sendResponse(res, {
      statusCode: HttpStatusCode.OK,
      success: true,
      message: "Your password has been changed. Please login to your account",
      data: null,
    });
  });

  logout = this.catchAsync(async (req: Request, res: Response) => {
    cookieManager.clearTokens(res);
    this.sendResponse(res, {
      statusCode: HttpStatusCode.OK,
      success: true,
      message: "Your have logged out",
      data: null,
    });
  });
}

export const UserController = new Controller();
