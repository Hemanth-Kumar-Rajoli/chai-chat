const nodeMailer = require('nodemailer');
const checkAsync = require('./erroHandilings/checkAsync');
const sendEmail = async(options)=>{
    const traspoter = nodeMailer.createTransport({
        host:process.env.MAIL_TRAP_HOST,
        port:process.env.MAIL_TRAP_PORT,
        auth:{
            user:process.env.MAIL_TRAP_USER_NAME,
            pass:process.env.MAIL_TRAP_USER_PASSWORD
        }
    })
    const mailOptions={
        from:"chai-chat <Hemanth Kumar Rajoli>",
        to:options.email,
        subject:options.subject,
        html:options.html,
        text:options.message
    }
    await traspoter.sendMail(mailOptions);
}
module.exports = sendEmail;