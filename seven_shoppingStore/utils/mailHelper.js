const nodemailer = require("nodemailer")

const mailHelper = async(data)=>{
    const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    });


  const message = {
    from: '"Maddison Foo Koch" <maddison53@ethereal.email>',
    to: data.toEmail,
    subject: data.subject,
    text: data.message, // plain‑text body
    // html: "<b>Hello world?</b>", // HTML body
  }
  await transporter.sendMail();

  console.log("Message sent:", info.messageId);
}

module.exports = mailHelper