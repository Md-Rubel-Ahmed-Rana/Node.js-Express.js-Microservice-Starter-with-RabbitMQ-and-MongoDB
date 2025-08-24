import { Schema, model } from "mongoose";
import { IUser } from "./user.interface";
import { ROLES } from "@/constants/roles";
import { schemaOptions } from "@/utils/schemaOptions";

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    phone_number: { type: String, required: true },
    email: { type: String, default: "" },
    role: { type: String, default: ROLES.USER },
    password: { type: String, required: true },
    status: { type: String, enum: ["active", "inactive"], default: "inactive" },
    last_login_at: { type: Date, default: null },
  },
  schemaOptions
);

export const UserModel = model<IUser>("User", userSchema);
