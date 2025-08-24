import fs from "fs";
import path from "path";
import { emitter } from "./eventEmitter";

emitter.on("apiLog", async (logData) => {
  const logFilePath = path.join(
    __dirname,
    "../../logs/api_data_logger_" +
      new Date().toISOString().slice(0, 10) +
      ".log"
  );

  try {
    await fs.promises.appendFile(logFilePath, JSON.stringify(logData) + "\n");
  } catch (err) {
    console.error("Error writing to log file:", err);
  }
});
