import Joi from 'joi'

export const updateCommissionSchema = Joi.object({
  percent: Joi.number().min(0).max(100).required().messages({
    'number.base': 'Phần trăm hoa hồng phải là một số',
    'number.min': 'Phần trăm hoa hồng không được nhỏ hơn 0',
    'number.max': 'Phần trăm hoa hồng không được lớn hơn 100',
    'any.required': 'Phần trăm hoa hồng là bắt buộc'
  })
}).messages({
  'object.unknown': 'Thông tin không hợp lệ, vui lòng kiểm tra lại'
})
