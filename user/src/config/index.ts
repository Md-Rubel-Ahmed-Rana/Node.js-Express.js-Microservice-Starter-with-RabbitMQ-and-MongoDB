import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export const envConfig = {
  app: {
    port: process.env.PORT ? Number(process.env.PORT) : 5005,
    env: process.env.NODE_ENV as "development" | "production",
  },
  cors_origins: process.env.CORS_ORIGINS
    ? (process.env.CORS_ORIGINS as string).split(", ")
    : [],
  database: {
    mongodb_url: process.env.MONGODB_URL as string,
  },
  jwt: {
    access_token_expires: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
    refresh_token_expires: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
    secret: process.env.JWT_TOKEN_SECRET as string,
    access_cookie_name: "cbd_atkn_91f2a",
    refresh_cookie_name: "cbd_rtkn_7c4d1",
  },
  rabbitmq: {
    url: process.env.RABBITMQ_URL as string,
    service_name: process.env.SERVICE_NAME as string,
  },
};
