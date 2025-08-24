import { Server } from "http";
import app from "./app";
import { envConfig } from "./config";
import mongodbConnection from "./config/mongoDbConnection";
import { RabbitMQService } from "./modules/rabbitmq/rabbitmq.service";

process.on("uncaughtException", (error) => {
  console.error(`Uncaught Exception: ${error.message}`, { stack: error.stack });
  process.exit(1);
});

let server: Server;
const port = envConfig.app.port;

async function main() {
  try {
    // connect to database
    await mongodbConnection();

    // connect to RabbitMQ
    await RabbitMQService.init();

    server = app.listen(port, async () => {
      console.info(` Order microservice is running on port ${port}`);
    });
  } catch (error: any) {
    console.error(`❌ Failed to start server: ${error.message}`, {
      stack: error.stack,
    });
    process.exit(1);
  }

  process.on("unhandledRejection", (error: any) => {
    console.error(`Unhandled Promise Rejection: ${error?.message}`, {
      stack: error?.stack,
    });
    if (server) {
      server.close(() => process.exit(1));
    } else {
      process.exit(1);
    }
  });
}

main();

process.on("SIGTERM", () => {
  console.warn("SIGTERM received. Shutting down gracefully...");
  if (server) {
    server.close(() => {
      console.info("Server closed.");
    });
  }
});
