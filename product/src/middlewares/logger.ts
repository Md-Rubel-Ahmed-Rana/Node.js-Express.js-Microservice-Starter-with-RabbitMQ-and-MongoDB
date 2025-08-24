import { emitter } from "@/events/eventEmitter";
import { Request, Response, NextFunction } from "express";

export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();

  const originalSend = res.send;
  res.send = function (body?: any): any {
    const duration = Date.now() - startTime;

    const input = req.method === "GET" ? req.query : req.body;

    const logData = {
      timestamp: new Date().toISOString(),
      duration,
      ip: req.ip,
      method: req.method,
      input,
      output: body,
      fullUrl: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
    };

    // fire event to store/rewrite log file
    emitter.emitAsync("apiLog", logData);

    return originalSend.call(this, body);
  };

  next();
};
