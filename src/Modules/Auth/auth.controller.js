import { Router } from "express";
import * as authServices from "./auth.services.js"
import { validate } from "../../Middleware/validation.middleware.js";
import { confirmEmailSchema, forgetPasswordSchema, loginSchema, resetPasswordSchema, signupSchema } from "./auth.validation.js";
import { authentication, authorization, tokenTypeEnum } from "../../Middleware/auth.middleware.js";
const router = Router();

router.post("/signup" , validate(signupSchema) ,authServices.signup) 
router.post("/login" ,validate(loginSchema) ,authServices.login)
router.patch("/confirm-email" , validate(confirmEmailSchema) ,authServices.confirmEmail)
router.post("/revoke-token" , authServices.logout) 
router.post("/refresh-token" , authorization({tokenType : tokenTypeEnum.REFRESH}) ,authServices.refreshToken) 
router.patch("/forget-password" , validate(forgetPasswordSchema) ,authServices.forgetPassword) 
router.patch("/reset-password" , validate(resetPasswordSchema) ,authServices.resetPassword) 
router.post("/social-login" , validate(resetPasswordSchema) ,authServices.loginWithGoogle) 

export default router;