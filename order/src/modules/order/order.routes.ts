import { Router } from "express";
import { OrderController } from "./order.controller";

const router = Router();

router.post("/", OrderController.placeAnOrder);

export const OrderRoutes = router;
