import { BadRequestError } from "~/utils/errors";

/**
 * Middleware xử lý validation request với Joi schema
 * @param {Joi.Schema} schema - Joi schema
 * @param {String} property - Request property để validate (body, params, query)
 * @returns {Function} Express middleware function
 */
export const validateRequest = (schema, property = "body") => {
  return (req, res, next) => {
    const dataToValidate = req[property];
    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false, // Trả về tất cả lỗi validation
      stripUnknown: true, // Loại bỏ các trường không có trong schema
      errors: { wrap: { label: false } }, // Không wrap trường trong dấu ngoặc kép
      messages: { "string.pattern.base": "{#label}" } // Custom message cho pattern
    });

    if (error) {
      // Format lỗi validation thành object
      const validationErrors = {};

      error.details.forEach((detail) => {
        // Lấy tên trường từ path
        const key = detail.path.join(".");

        // Thêm vào object lỗi
        validationErrors[key] = detail.message;
      });

      // Trả về lỗi với thông báo và chi tiết lỗi validation
      return next(new BadRequestError("Dữ liệu không hợp lệ", validationErrors));
    }

    // Gán dữ liệu đã validate vào request
    req[property] = value;
    return next();
  };
};
