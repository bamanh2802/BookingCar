import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { env } from "~/config/environment";
import { instanceMongodb } from "~/config/mongodb";
import { errorHandlingMiddleware } from "~/middlewares/errorHandlingMiddleware";
import { API_V1 } from "~/routes/v1";
import logger from "~/utils/logger";
import { corsOptions } from "./config/cors";

// Biến toàn cục để lưu instance server
let server;

/**
 * Tạo và cấu hình express app
 * @returns {Express} Express app
 */
const createApp = () => {
  const app = express();

  // Middleware cơ bản
  app.use(cors(corsOptions));
  app.use(express.json({ limit: "10kb" })); // Giới hạn kích thước body request
  app.use(cookieParser());

  // Middleware bảo mật
  app.use(helmet()); // Bảo vệ các HTTP headers

  // Rate limiting - giới hạn số lượng request từ một IP
  const apiLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 phút
    max: 1000, // Giới hạn mỗi IP 1000 requests mỗi 5 phút
    standardHeaders: true, // Trả về thông tin rate limit trong header `RateLimit-*`
    legacyHeaders: false, // Disable các header `X-RateLimit-*`
    message: "Quá nhiều request từ IP này, vui lòng thử lại sau 5 phút"
  });

  // Áp dụng rate limiting cho tất cả các route API
  app.use("/v1", apiLimiter);

  // Routes
  app.use("/v1", API_V1);

  // Middleware xử lý lỗi - phải đặt sau khi định nghĩa routes
  app.use(errorHandlingMiddleware);

  return app;
};

/**
 * Khởi động server
 */
const START_SERVER = async () => {
  try {
    // Kết nối đến MongoDB trước
    logger.info("Connecting to MongoDB Cloud Atlas...");
    await instanceMongodb.connect();
    logger.info("Connected to MongoDB Cloud Atlas successfully!");

    // Tạo express app
    const app = createApp();

    // Khởi động server và lưu instance
    server = app.listen(env.APP_PORT, env.APP_HOST, () => {
      logger.info(`App listening at http://${env.APP_HOST}:${env.APP_PORT}/`);
    });

    // Xử lý unhandled rejection
    setupErrorHandlers();
  } catch (error) {
    logger.error("Failed to start server due to MongoDB connection error:", error);
    process.exit(1);
  }
};

/**
 * Thiết lập xử lý lỗi cho process
 */
const setupErrorHandlers = () => {
  // Xử lý unhandled promise rejections
  process.on("unhandledRejection", (reason, promise) => {
    logger.error("Unhandled Promise Rejection:", reason);

    // Trong production, gracefully shutdown để tránh mất dữ liệu
    if (env.BUILD_MODE === "production") {
      gracefulShutdown();
    }
  });

  // Xử lý uncaught exceptions
  process.on("uncaughtException", (error) => {
    logger.error("Uncaught Exception:", error);

    // Luôn shutdown server với uncaught exception
    gracefulShutdown();
  });

  // Xử lý SIGTERM signal (kill command)
  process.on("SIGTERM", () => {
    logger.info("SIGTERM received. Shutting down gracefully...");
    gracefulShutdown();
  });

  // Xử lý SIGINT signal (ctrl+c)
  process.on("SIGINT", () => {
    logger.info("SIGINT received. Shutting down gracefully...");
    gracefulShutdown();
  });
};

/**
 * Đóng server và database một cách graceful
 */
const gracefulShutdown = () => {
  logger.info("Starting graceful shutdown...");

  if (server) {
    server.close(async () => {
      logger.info("Express server closed.");

      try {
        // Đóng kết nối database
        await instanceMongodb.disconnect();
        logger.info("Database connections closed.");

        // Thoát với exit code 0
        logger.info("Process exited with code 0");
        process.exit(0);
      } catch (error) {
        logger.error("Error during shutdown:", error);
        process.exit(1);
      }
    });

    // Nếu server không đóng sau 10s, force exit
    setTimeout(() => {
      logger.error("Server close timeout. Forcing exit...");
      process.exit(1);
    }, 10000);
  } else {
    process.exit(0);
  }
};

// Khởi động server
START_SERVER();
