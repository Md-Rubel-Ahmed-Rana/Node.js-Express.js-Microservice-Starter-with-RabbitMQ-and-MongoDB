import { Response } from "express";
import { envConfig } from "../config";

class CookieManager {
  private readonly accessTokenName = envConfig.jwt.access_cookie_name;
  private readonly refreshTokenName = envConfig.jwt.refresh_cookie_name;

  private cookieOptions = {
    httpOnly: true,
    sameSite: "none" as const,
    secure: true,
    maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
  };

  private clearCookieOptions = {
    httpOnly: true,
    sameSite: "none" as const,
    secure: true,
  };

  public setTokens(
    res: Response,
    accessToken: string,
    refreshToken: string
  ): void {
    res.cookie(this.accessTokenName, accessToken, this.cookieOptions);
    res.cookie(this.refreshTokenName, refreshToken, this.cookieOptions);
  }

  public clearTokens(res: Response): void {
    res.clearCookie(this.accessTokenName, this.clearCookieOptions);
    res.clearCookie(this.refreshTokenName, this.clearCookieOptions);
  }
}

export const cookieManager = new CookieManager();
