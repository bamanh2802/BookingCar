import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'
import { userModel } from '~/models/userModel'
import { jwtProvider } from '~/providers/jwtProvider'
import ApiError from '~/utils/ApiError'
import { pickUser } from '~/utils/formatter'

const register = async (reqBody) => {
  try {
    const existedUser = await userModel.findOne({ $or: [{ email: reqBody.email }, { phone: reqBody.phone }] })

    if (existedUser) throw new ApiError(StatusCodes.CONFLICT, 'Phone number or email already exists!!')

    // const clientRole = await UserRole.findOne({ roleName: 'Client' })
    // if (!clientRole) {
    //   throw new Error('Client role not found. Please initialize UserRole data first.')
    // }

    const user = await userModel.create({
      email: reqBody.email,
      password: reqBody.password,
      fullName: reqBody.fullName,
      phone: reqBody.phone
    })

    await user.save()

    return pickUser(user)
  } catch (error) {
    throw error
  }
}

const login = async (reqBody) => {
  try {
    const user = await userModel.findOne({ $or: [{ email: reqBody.email }, { phone: reqBody.phone }] })
    if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'Email or Phone number not found !')

    const isMatchPassword = await user.comparePassword(reqBody.password)
    if (!isMatchPassword) throw new ApiError(StatusCodes.BAD_GATEWAY, 'Wrong password !')
    const userInfo = {
      _id: user._id,
      email: user.email,
      phone: user.phone
    }

    const accessToken = await jwtProvider.generateToken(userInfo, env.ACCESS_TOKEN_SECRET_KEY, env.ACCESS_TOKEN_LIFE)
    const refreshToken = await jwtProvider.generateToken(userInfo, env.REFRESH_TOKEN_SECRET_KEY, env.REFRESH_TOKEN_LIFE)

    return { accessToken, refreshToken, ...pickUser(user) }
  } catch (error) {
    throw error
  }
}

export const userService = { register, login }
