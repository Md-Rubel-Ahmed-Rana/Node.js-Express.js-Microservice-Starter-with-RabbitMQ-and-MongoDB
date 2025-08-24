import { Schema, model } from "mongoose";
import { IProduct } from "./product.interface";
import { schemaOptions } from "@/utils/schemaOptions";

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 0 },
    total_sold: { type: Number, required: true, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  schemaOptions
);

export const ProductModel = model<IProduct>("Product", productSchema);
