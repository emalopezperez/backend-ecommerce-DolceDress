const nodemailer = require("nodemailer");

const sendEmail = async (data) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: process.env.MAIL_ID,
      pass: process.env.MP,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: '"Fred Foo 👻" <foo@example.com>',
      to: data.to,
      subject: data.subject,
      text: data.text,
      html: data.html,
    });

    console.log("Correo electrónico enviado:", info);
    return info;
  } catch (error) {
    console.error("Error al enviar el correo electrónico:", error);
    throw error;
  }
};

module.exports = sendEmail;
