const { StatusCodes } = require('http-status-codes')
const { jwtProvider } = require('~/providers/jwtProvider')

const isAuthorized = async (req, res, next) => {
  const publicKey = process.env.PUBLIC_KEY.replace(/\\n/g, '\n')
  const accessToken = req.cookies?.accessToken
  if (!accessToken) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized !!!' })
    return
  }

  try {
    const accessTokenDecoded = await jwtProvider.verifyToken(accessToken, publicKey)
    req.jwtDecoded = accessTokenDecoded
    next()
  } catch (error) {
    //TH1: accessToken expired
    if (error.message?.includes('jwt expired')) {
      res.status(StatusCodes.GONE).json({ message: 'Need to refresh accessToken' })
      return
    }

    //Th2: Other error
    res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized !!!' })
  }
}

const isAdmin = async (req, res, next) => {
  try {
    if (req.jwtDecoded.roles !== 'admin') res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized !!!' })

    next()
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error !!!' })
  }
}

export const authMiddleware = { isAuthorized, isAdmin }
