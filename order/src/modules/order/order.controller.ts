import BaseController from "@/shared/baseController";
import { Request, Response } from "express";
import { HttpStatusCode } from "@/lib/httpStatus";
import { OrderService } from "./order.service";

class Controller extends BaseController {
  placeAnOrder = this.catchAsync(async (req: Request, res: Response) => {
    const order = await OrderService.placeAnOrder(req.body);
    this.sendResponse(res, {
      statusCode: HttpStatusCode.CREATED,
      success: true,
      message: "Order created successfully",
      data: order,
    });
  });
}

export const OrderController = new Controller();
