import { roleEnum } from "../../DB/Models/user.model.js";
import { generalField } from "../../Middleware/validation.middleware.js";
import joi from "joi" 

export const signupSchema = {
    body : joi.object({
        firstName: generalField.firstName.required(),
        lastName: generalField.lastName.required(),
        email: generalField.email.required(),
        password: generalField.password.required(),
        confirm_email: generalField.confirm_email,
        gender: generalField.gender.required(),
        phone: generalField.phone,
        role : joi.string().valid("USER" , "ADMIN").default(roleEnum.USER)
})
};

export const loginSchema = {
    body : joi.object({
    email: generalField.email.required(),
    password: generalField.password.required(),
})
}

export const confirmEmailSchema = {
    body : joi.object({
    email: generalField.email.required(),
    otp: generalField.otp.required(),
})
}

export const forgetPasswordSchema = {
    body : joi.object({
    email: generalField.email.required(),
})
}

export const resetPasswordSchema = {
    body : joi.object({
    email: generalField.email.required(),
    otp : generalField.otp.required(),
    password : generalField.password.required(),
    confirm_email : generalField.confirm_email
})
}

