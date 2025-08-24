import { randomBytes } from "crypto";

export const generateUniqueCode = (): string => {
  return randomBytes(3).toString("hex");
};
