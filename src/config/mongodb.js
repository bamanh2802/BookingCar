import mongoose from "mongoose";
import logger from "~/utils/logger";
import { env } from "./environment";

/**
 * Lớp quản lý kết nối MongoDB
 * Sử dụng Singleton pattern để đảm bảo chỉ có một kết nối duy nhất
 */
class Database {
  constructor() {
    this.connection = null;
    this.isConnected = false;
  }

  /**
   * Kết nối đến MongoDB
   * @returns {Promise<mongoose.Connection>} Mongoose connection
   */
  async connect() {
    try {
      // Nếu đã kết nối, trả về kết nối hiện tại
      if (this.isConnected) {
        logger.debug("Đã có kết nối MongoDB, sử dụng kết nối hiện tại");
        return this.connection;
      }

      // Thiết lập các options cho kết nối
      const connectOptions = {
        maxPoolSize: 50, // Số lượng kết nối tối đa
        dbName: env.DATABASE_NAME,
        serverSelectionTimeoutMS: 5000, // Timeout cho server selection
        heartbeatFrequencyMS: 10000, // Tần suất heartbeat
        retryWrites: true // Thử lại writes nếu thất bại
      };

      // Kết nối đến MongoDB
      const connection = await mongoose.connect(env.MONGODB_URI, connectOptions);

      // Lưu trữ kết nối và cập nhật trạng thái
      this.connection = connection;
      this.isConnected = true;

      // Lắng nghe các sự kiện từ kết nối
      mongoose.connection.on("error", this._handleConnectionError);
      mongoose.connection.on("disconnected", this._handleDisconnect);

      return this.connection;
    } catch (error) {
      logger.error("Lỗi kết nối MongoDB:", error);
      throw error;
    }
  }

  /**
   * Ngắt kết nối MongoDB
   * @returns {Promise<void>}
   */
  async disconnect() {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      this.connection = null;
      logger.info("Đã ngắt kết nối MongoDB");
    } catch (error) {
      logger.error("Lỗi khi ngắt kết nối MongoDB:", error);
      throw error;
    }
  }

  /**
   * Xử lý lỗi kết nối
   * @private
   */
  _handleConnectionError(error) {
    logger.error("Lỗi kết nối MongoDB:", error);
  }

  /**
   * Xử lý khi mất kết nối
   * @private
   */
  _handleDisconnect() {
    logger.warn("Mất kết nối MongoDB, đang thử kết nối lại...");
    // Có thể thêm logic thử kết nối lại ở đây
  }

  /**
   * Lấy instance của Database (Singleton)
   * @returns {Database} Database instance
   */
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

// Export singleton instance
export const instanceMongodb = Database.getInstance();
