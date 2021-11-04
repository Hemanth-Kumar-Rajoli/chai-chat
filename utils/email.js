const nodeMailer = require('nodemailer');
const checkAsync = require('./erroHandilings/checkAsync');
const sendEmail = async(options)=>{
    // const traspoter = nodeMailer.createTransport({
    //     host:process.env.MAIL_TRAP_HOST,
    //     port:process.env.MAIL_TRAP_PORT,
    //     auth:{
    //         user:process.env.MAIL_TRAP_USER_NAME,
    //         pass:process.env.MAIL_TRAP_USER_PASSWORD
    //     }
    // })
    const traspoter = nodeMailer.createTransport({
        service:'SendGrid',
        auth:{
            user:process.env.NODE_MIALER_USER_NAME,
            pass:process.env.NODE_MAILER_USER_PASSWORD
        }
    })
    const mailOptions={
        from:"hemanthkumarrajoli@gmail.com",
        to:options.email,
        subject:options.subject,
        html:options.html,
        text:options.message
    }
    await traspoter.sendMail(mailOptions);
}
module.exports = sendEmail;