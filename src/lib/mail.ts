import nodemailer from 'nodemailer'

import { ENV } from '../env'

export const mail = nodemailer.createTransport({
  url: ENV.MAILER_SMTP_URL,
})
