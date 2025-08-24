import { Schema, model } from "mongoose";
import { IOrder, IOrderItem } from "./order.interface";
import { schemaOptions } from "@/utils/schemaOptions";

const orderItem = new Schema<IOrderItem>({
  productId: { type: String, required: true },
  qty: { type: Number, required: true },
  price: { type: Number, required: true },
});

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: String, required: true },
    items: { type: [orderItem], required: true },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "confirmed",
    },
  },
  schemaOptions
);

export const OrderModel = model<IOrder>("Order", orderSchema);
