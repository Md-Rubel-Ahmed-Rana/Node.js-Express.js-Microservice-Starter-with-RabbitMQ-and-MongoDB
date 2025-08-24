import { Router } from "express";
import { ProductController } from "./product.controller";

const router = Router();

router.post("/", ProductController.create);

router.post("/many", ProductController.createMany);

export const ProductRoutes = router;
