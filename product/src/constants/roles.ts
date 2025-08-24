export const ROLES = {
  // Platform roles
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  SUPPORT_STAFF: "support_staff",
  CONTENT_MANAGER: "content_manager",
  ACCOUNT_MANAGER: "account_manager",
  LOGISTICS_MANAGER: "logistics_manager",

  // Vendor roles
  VENDOR_OWNER: "vendor_owner",
  VENDOR_ADMIN: "vendor_admin",
  VENDOR_MANAGER: "vendor_manager",
  VENDOR_STAFF: "vendor_staff",
  VENDOR_ANALYST: "vendor_analyst",

  // Customer roles
  CUSTOMER: "customer",
  USER: "user",
  SUBSCRIBER: "subscriber",
  WHOLESALE_BUYER: "wholesale_buyer",
};

export type IRoles = (typeof ROLES)[keyof typeof ROLES];
