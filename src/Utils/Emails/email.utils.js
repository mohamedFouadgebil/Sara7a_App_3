import nodemailer from "nodemailer";

export async function sendEmail(
    {
        to = "",
        subject = "",
        text = "", 
        html = "", 
        bcc = "",
        cc = "",
        attachments = [], 
    }
)
{
    const transporter = nodemailer.createTransport({
        service : "gmail",
        auth: {
            user: process.env.USER,
            pass: process.env.PASSWORD,
        },
        tls: {
            rejectUnauthorized: false
        },
    });
    
    const info = await transporter.sendMail({
        from: `"Sara7a App" <${process.env.USER}>`,
        to,
        subject,
        text, 
        html, 
        bcc,
        cc,
        attachments,
    });
    
}

export const subjectMessage = {
    ResetPassword : "Reset Your Password",
    ConfirmEmail : "Confirm Your Email"
}