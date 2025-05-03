import ms from 'ms'
import { userService } from '~/services/userService'

const { StatusCodes } = require('http-status-codes')

const register = async (req, res, next) => {
  try {
    const createdUser = await userService.register(req.body)
    res.status(StatusCodes.CREATED).json(createdUser)
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const userInfo = await userService.login(req.body)
    res.cookie('accessToken', userInfo.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })

    res.cookie('refreshToken', userInfo.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })
    res.status(StatusCodes.OK).json(userInfo)
  } catch (error) {
    next(error)
  }
}

export const userController = { register, login }
