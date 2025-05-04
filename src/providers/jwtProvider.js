import jwt from "jsonwebtoken";

const generateToken = async (userInfo, secretKey, tokenLife) => {
  try {
    return jwt.sign(userInfo, secretKey, {
      algorithm: "HS256",
      expiresIn: tokenLife
    });
  } catch (error) {
    throw new Error(error);
  }
};

const verifyToken = async (token, secretKey) => {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    throw new Error(error);
  }
};

export const jwtProvider = { generateToken, verifyToken };
