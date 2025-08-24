import { Router } from "express";
import { UserController } from "./user.controller";
import { JwtInstance } from "@/lib/jwt";
import { ROLES } from "@/constants/roles";

const router = Router();

router.post("/", UserController.create);

router.post("/login", UserController.login);

router.get(
  "/auth",
  JwtInstance.authenticate([
    ROLES.VENDOR_OWNER,
    ROLES.VENDOR_ADMIN,
    ROLES.VENDOR_MANAGER,
    ROLES.VENDOR_STAFF,
    ROLES.VENDOR_ANALYST,
    ROLES.CUSTOMER,
    ROLES.SUBSCRIBER,
    ROLES.WHOLESALE_BUYER,
  ]),
  UserController.getLoggedInUser
);

router.patch("/reset-password", UserController.resetPassword);

router.patch(
  "/change-password",
  JwtInstance.authenticate([
    ROLES.VENDOR_OWNER,
    ROLES.VENDOR_ADMIN,
    ROLES.VENDOR_MANAGER,
    ROLES.VENDOR_STAFF,
    ROLES.VENDOR_ANALYST,
    ROLES.CUSTOMER,
    ROLES.SUBSCRIBER,
    ROLES.WHOLESALE_BUYER,
  ]),
  UserController.changePassword
);

router.delete("/logout", UserController.logout);

export const UserRoutes = router;
