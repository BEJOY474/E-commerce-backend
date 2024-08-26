const nodemailer = require("nodemailer");

const config = require('../../config/config')
const smptUserName = config.SMTP.userName
const smptPassword = config.SMTP.password

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: smptUserName,
        pass: smptPassword,
    },
});

// async..await is not allowed in global scope, must use a wrapper
exports.emailWithNodeMailer = async (emailData) => {
    try {
        const mailOptions = {
            from: smptUserName, // sender address
            to: emailData.email, // list of receivers
            subject: emailData.sebject, // Subject line
            html: emailData.html, // html body
        }

        const info = await transporter.sendMail(mailOptions)

        console.log("Message sent: %s", info.response);
    } catch (error) {
        console.error("Email sending error : ", error)
        throw error
    }

}