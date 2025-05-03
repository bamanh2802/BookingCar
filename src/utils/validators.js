export const OBJECT_ID_RULE = /^[0-9a-fA-F]{24}$/
export const MONTH_RULE = /^(0[1-9]|1[0-2])$/
export const OBJECT_ID_RULE_MESSAGE = 'Your string fails to match the Object Id pattern!'

export const EMAIL_RULE = /^\S+@\S+\.\S+$/
export const EMAIL_RULE_MESSAGE = 'Invalid email address'
export const PASSWORD_RULE = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
export const PASSWORD_RULE_MESSAGE =
  'Password must contain at least 8 characters, including uppercase, lowercase letters and numbers'
export const PHONE_NUMBER_RULE = /^0\d{9,10}$/
