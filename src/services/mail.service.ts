import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.mailersend.net',
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    }
})

export const MailService = {
    sendMail: async ({
    to, 
    subject, 
    text, 
    html,
    }: {
    to: string,
    subject: string,
    text?: string,
    html?: string,
    }) => {
    await transporter.sendMail({
        from: `"Ecommerce Platform" <${process.env.SMTP_USER}>`,
        to,
        subject,
        text,
        html,
    })
    }
}