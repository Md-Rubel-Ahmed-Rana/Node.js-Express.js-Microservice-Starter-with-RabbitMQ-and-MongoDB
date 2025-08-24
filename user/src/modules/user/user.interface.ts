export type IUser = {
  name: string;
  phone_number: string;
  email: string;
  role: string;
  password: string;
  status: "inactive" | "active";
  last_login_at: Date;
};

export enum USER_STATUS {
  ACTIVE = "active",
  INACTIVE = "inactive",
}
