import { transporter } from '~/config/transporter'
import { env } from '~/config/environment'
import fs from 'fs'
import path from 'path'

const sendEmail = async (to, subject, htmlContent) => {
  try {
    const mailOptions = {
      from: `"BookingCar" <${env.SENDER_EMAIL}>`,
      to: to,
      subject: subject,
      html: htmlContent
    }

    return await transporter.sendMail(mailOptions)
  } catch (error) {
    console.error('Error sending email: ', error)
    throw error
  }
}

const getEmailTemplate = (templateName, replacements) => {
  try {
    const templatePath = path.join(__dirname, '..', 'templates', 'emails', `${templateName}.html`)
    let template = fs.readFileSync(templatePath, 'utf8')

    for (const key in replacements) {
      const regex = new RegExp(`{{${key}}}`, 'g')
      template = template.replace(regex, replacements[key])
    }

    return template
  } catch (error) {
    console.error('Error reading email template: ', error)
    throw new Error('Could not read email template.')
  }
}

export const emailService = {
  sendEmail,
  getEmailTemplate
} 