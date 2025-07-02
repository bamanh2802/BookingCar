import nodemailer from 'nodemailer'
import { env } from '~/config/environment'

export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: env.SENDER_EMAIL,
    pass: env.SENDER_PASSWORD
  }
}) 