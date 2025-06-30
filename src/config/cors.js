import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'
import { ApiError } from '~/utils/errors'

// Cấu hình CORS Option trong dự án thực tế
// Danh sách các domain được chấp nhận CORS
const WHITELIST_DOMAINS = ['http://localhost:5173', 'http://localhost:3000', 'https://vexenay.com']

//config dynamic cors
export const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) {
      return callback(null, true)
    }
    
    if (WHITELIST_DOMAINS.includes(origin)) {
      return callback(null, origin) 
    }

    return callback(new ApiError(StatusCodes.FORBIDDEN, `${origin} không được phép bởi CORS Policy của chúng tôi.`))
  },

  optionsSuccessStatus: 200,

  credentials: true
}