const nodeMailer = require('nodemailer');

const sendEmail = (options) => {
    const transporter = nodeMailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        //secure: false, // use TLS
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    });
    
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to:  options.to,
        subject: options.subject,
        html: options.text
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log(info);
        }
    })
}

module.exports = sendEmail;




