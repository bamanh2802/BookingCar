import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import fs from 'fs'

const generateToken = async (userInfo, secretKey, tokenLife) => {
  try {
    return jwt.sign(userInfo, secretKey, {
      algorithm: 'RS256',
      expiresIn: tokenLife
    })
  } catch (error) {
    throw new Error(error)
  }
}

const verifyToken = async (token, secretKey) => {
  try {
    return jwt.verify(token, secretKey)
  } catch (error) {
    throw new Error(error)
  }
}

// const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
//   modulusLength: 2048,
//   publicKeyEncoding: {
//     type: 'spki',
//     format: 'pem'
//   },
//   privateKeyEncoding: {
//     type: 'pkcs8',
//     format: 'pem'
//   }
// })

// // Save to file `.pem`
// const secretKeyPair = `
// PRIVATE_KEY="${privateKey.replace(/\n/g, '\\n')}"
// PUBLIC_KEY="${publicKey.replace(/\n/g, '\\n')}"
// `
// fs.appendFileSync('.env', secretKeyPair)

export const jwtProvider = { generateToken, verifyToken }
