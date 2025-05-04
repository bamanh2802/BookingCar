import path from "path";
import { createLogger, format, transports } from "winston";
import "winston-daily-rotate-file";
import { env } from "~/config/environment";

/**
 * Định dạng thông tin log khi ghi ra console và file
 */
const customFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.errors({ stack: true }),
  format.splat(),
  format.printf(
    (info) => `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message} ${info.stack || ""}`
  )
);

/**
 * Định dạng màu sắc cho console log
 */
const colorizedFormat = format.combine(
  format.colorize(),
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.printf((info) => `${info.timestamp} [${info.level}]: ${info.message} ${info.stack || ""}`)
);

// Xác định đường dẫn log file
const logDirectory = path.join(process.cwd(), "logs");

/**
 * Cấu hình file transport cho log với xoay vòng hàng ngày
 */
const fileRotateTransport = new transports.DailyRotateFile({
  dirname: logDirectory,
  filename: "%DATE%-app.log",
  datePattern: "YYYY-MM-DD",
  maxFiles: "14d", // Giữ log tối đa 14 ngày
  maxSize: "20m", // Kích thước tối đa mỗi file log
  level: env.NODE_ENV === "production" ? "info" : "debug",
  format: customFormat,
  zippedArchive: true // Nén file log cũ
});

/**
 * Cấu hình file transport riêng cho lỗi
 */
const errorFileRotateTransport = new transports.DailyRotateFile({
  dirname: logDirectory,
  filename: "%DATE%-error.log",
  datePattern: "YYYY-MM-DD",
  maxFiles: "14d",
  maxSize: "20m",
  level: "error",
  format: customFormat,
  zippedArchive: true
});

/**
 * Cấu hình transport cho console
 */
const consoleTransport = new transports.Console({
  level: env.NODE_ENV === "production" ? "info" : "debug",
  format: colorizedFormat
});

/**
 * Tạo logger instance
 */
const logger = createLogger({
  level: env.NODE_ENV === "production" ? "info" : "debug",
  defaultMeta: { service: "booking-car-api" },
  transports: [fileRotateTransport, errorFileRotateTransport, consoleTransport],
  // Xử lý ngoại lệ và reject
  exceptionHandlers: [
    new transports.DailyRotateFile({
      dirname: logDirectory,
      filename: "%DATE%-exceptions.log",
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
      format: customFormat
    }),
    new transports.Console({
      format: colorizedFormat
    })
  ],
  rejectionHandlers: [
    new transports.DailyRotateFile({
      dirname: logDirectory,
      filename: "%DATE%-rejections.log",
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
      format: customFormat
    }),
    new transports.Console({
      format: colorizedFormat
    })
  ],
  exitOnError: false // Không thoát ứng dụng khi có lỗi
});

/**
 * Thiết lập level cho log dựa trên môi trường
 */
if (env.NODE_ENV !== "production") {
  logger.debug("Logs initialized in development mode");
}

export default logger;
