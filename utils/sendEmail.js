const nodeMailer = require('nodemailer')

const sendEmail = async (options) => {
    // This is the Nodemailer Transporter
    const transporter = nodeMailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        }
    })

    // This is the Message Format
    const message = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    }


    const info = await transporter.sendMail(message)

    console.log("Message sent: %s", info.messageId)
}

module.exports = sendEmail;