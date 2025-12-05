import { EventEmitter } from "node:events";
import { sendEmail, subjectMessage } from "../Emails/email.utils.js";
import { template } from "../Emails/generateHTML.js";

export const eventEmitter = new EventEmitter();

eventEmitter.on("confirmEmail" , async(data)=>{
    sendEmail({
        to : data.to,
        subject : subjectMessage.ConfirmEmail,
        text : "Confirm Your E-mail",
        html : template(data.otp , data.firstName , subjectMessage.ConfirmEmail)
    }).catch((err)=>{
        console.log(`Error on listen event email` , err.message);
    })
})

eventEmitter.on("forgetPassword" , async(data)=>{
    sendEmail({
        to : data.to,
        subject : subjectMessage.ResetPassword,
        text : "Reset Your Password",
        html : template(data.otp , data.firstName , subjectMessage.ResetPassword)
    }).catch((err)=>{
        console.log(`Error on listen event email` , err.message);
    })
})