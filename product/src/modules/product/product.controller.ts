import BaseController from "@/shared/baseController";
import { Request, Response } from "express";
import { ProductService } from "./product.service";
import { HttpStatusCode } from "@/lib/httpStatus";

class Controller extends BaseController {
  create = this.catchAsync(async (req: Request, res: Response) => {
    const product = await ProductService.create(req.body);
    this.sendResponse(res, {
      statusCode: HttpStatusCode.CREATED,
      success: true,
      message: "Product created successfully",
      data: product,
    });
  });

  createMany = this.catchAsync(async (req: Request, res: Response) => {
    const products = await ProductService.createMany(req.body);
    this.sendResponse(res, {
      statusCode: HttpStatusCode.CREATED,
      success: true,
      message: "Products created successfully",
      data: products,
    });
  });
}

export const ProductController = new Controller();
