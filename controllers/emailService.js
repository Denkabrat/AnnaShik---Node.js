const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            secure: false,
            port: 587,
            host: "smpt.gmail.com",
            auth: {
                user: process.env.GMAIL_USER, // ваша почта с которой будут отправляться письма
                pass: process.env.GMAIL_PASSWORD // ваш пароль
            }
        });

        const mailOptions = {
            //здесь указать свою почту
            from: process.env.GMAIL_FROM,
            to,
            subject,
            text,
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = {
    sendEmail
};