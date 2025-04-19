import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log("gmail services is not ready to send the email , please check the email configuration");
  }
  else{
    console.log("gmail service is ready to send the email");
  }
});

const sendEmail = async (to: string, subject: string, body: string) => {
  await transporter.sendMail({
    from: `"Your BookKart" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: body,
  });
};

export const sendVerificationToEmail = async (to: string, token: string) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
  const html = `<h1>Welcome to your BookKart! Verify Your Email</h1>
                <p>Thank You for registering. Please click the link below to verify your email address:</p>
                <a href="${verificationUrl}">Verify Email Here!</a>
                <p>If you didn't request this or already verified , please ignore this email.</p>`

                await sendEmail(to , "Please Verify Your Email To Access Your BookKart" , html)
};


export const sendResetPasswordLink= async (to: string, token: string) => {

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    const html = `<h1>Welcome to your BookKart! Reset Your Password</h1>
                  <p>You Have requested to reset your password.Click the link below to reset your password</p>
                  <a href="${resetUrl}">reset password Here!</a>
                  <p>If you didn't request this or already verified , please ignore this email and your password will remain unchanged</p>`
  
                  await sendEmail(to , "Reset Your Password" , html)
  };
