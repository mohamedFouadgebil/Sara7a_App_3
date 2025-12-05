import userModel, { genderEnum, providerEnum } from "../../DB/Models/user.model.js";
import { sendEmail, subjectMessage } from "../../Utils/Emails/email.utils.js";
import { encrypt } from "../../Utils/Encryption/encryption.utils.js";
import { compare, hash } from "../../Utils/Hashing/hash.utils.js";
import { successResponse } from "../../Utils/successResponse.utils.js";
import * as dbServices from "../../DB/dbServices.js"
import { eventEmitter } from "../../Utils/Events/email.event.utils.js";
import { customAlphabet, customRandom } from "nanoid";
import { generateToken, getNewLoginCredientiald, verifyToken } from "../../Utils/Tokens/token.utils.js";
import {v4 as uuid} from "uuid"
import tokenModel from "../../DB/Models/token.model.js";
import joi from "joi"
import {OAuth2Client} from "google-auth-library";
import { signupSchema } from "./auth.validation.js";

export const signup = async(req,res,next)=>{
    const {firstName , lastName , email , password , gender , phone} = req.body;
    
    const user = await dbServices.findOne({
        model : userModel,
        filter : {email},
    })
    if(user)
        return next(new Error("User already exists" , {cause : 500}))

    const otp = customAlphabet("012345678998765432101957324680" , 6)()

    const newUser = await dbServices.create({
        model : userModel,
        data : [{
            firstName , 
            lastName , 
            email , 
            password : await hash({plaintext : password}),
            gender , 
            phone : encrypt(password),
            confirmEmailOtp : await hash({plaintext : otp})
        }]
    })
    if(!newUser)
        return next(new Error("Fetching error" , {cause : 500}))

    eventEmitter.emit("confirmEmail" , {to : email , otp , firstName})

    return successResponse({
        res,
        status : 201,
        message : "User Created Successfully",
        data : {newUser}
    })
}

export const login = async(req,res,next)=>{
    const { email , password } = req.body;

    const user = await dbServices.findOne({
        model : userModel,
        filter : {email}
    })
    if(!user){
        return next(new Error("User Not Found" , {cause : 500}))
    }

    const isMatch = await compare({plaintext : password , hash : user.password})
    if(!isMatch)
        return next(new Error("password is not match" , {cause : 500}))

    if(!user.confirm_email)
        return next(new Error("Confirm your email first" , {cause : 400}))

    const cridentials = await getNewLoginCredientiald(user) 

    return successResponse({
        res,
        status : 200,
        message : "User Login Successfully",
        data : {cridentials}
    })
}

export const confirmEmail = async(req,res,next)=>{
    const {email , otp} = req.body;

    const checkUser = await dbServices.findOne({
        model : userModel,
        filter : {
            email,
            confirmEmailOtp : {$exists : true},
            confirm_email : {$exists : false}
        }
    })

    if(!checkUser)
        return next(new Error("User not found or email already confirmed" , {cause : 404}))

    const isMatch = await compare({plaintext : otp , hash : checkUser.confirmEmailOtp})
    if(!isMatch)
        return next(new Error("Invalid OTP" , {cause : 500}))

    const updateUserStatus = await dbServices.updateOne({
        model : userModel,
        filter : {email},
        data :{
            confirm_email : Date.now(),
            $unset : {confirmEmailOtp : true},
            $inc : {__v : 1}
        }
    }) 

    return successResponse({
        res,
        status : 200,
        message : "Email Confirmed Successfully",
    })
}

export const logout = async(req,res,next)=>{
    const {authorization} = req.headers;

    const decodedData = verifyToken({
        token : authorization,
        secretKey : process.env.TOKEN_ACCESS_SECRET
    })

    await dbServices.create({
        model : tokenModel,
        data :[
        {
            jwtid : decodedData.jti ,
            expiresIn : Date.now(decodedData.exp*1000), 
        }
    ]
    })

    return successResponse({
        res,
        status : 200,
        message : "Logout Successfully",
    })
}

export const refreshToken = async(req,res,next)=>{
    const user = req.user;
    const cridentials = await getNewLoginCredientiald(user) 
    return successResponse({
        res,
        status : 200,
        message : "Token refresh successfully",
        data : {cridentials}
    })
}

export const forgetPassword = async(req,res,next)=>{
    const { email } = req.body;

    const otp = await customAlphabet("0123456789987654321075315986240" , 6)()
    const hashOTP = await hash({plaintext : otp})

    const user = await dbServices.findOneAndUpdate({
        model : userModel,
        filter :{
            email,
            confirm_email : {$exists : true},
        },
        data : {
            forgetPasswordOtp : await hash({plaintext : otp}),
        }
    })
    if(!user)
        return next(new Error("User not found or email not confirmed" , {cause :500}))

    eventEmitter.emit("forgetPassword" , {
        to : email,
        firstName : user.firstName,
        otp
    })

    return successResponse({
        res,
        status:200,
        message : "Check your box",
    })
}

export const resetPassword = async(req,res,next)=>{
    const { email , otp , password } = req.body

    const user = await dbServices.findOne({
        model : userModel,
        filter : {email , confirm_email:{$exists : true}},
    })
    if(!user)
        return next(new Error("User not found or email not confirmed" , {cause : 500}))

    const isMatch = await compare({plaintext : otp , hash : user.forgetPasswordOtp})
    if(!isMatch)
        return next(new Error("Invalid OTP" , {cause : 400}))

    await dbServices.updateOne({
        model : userModel,
        filter : {email},
        data :{ 
            password : await hash({plaintext : password}),
            $unset : {forgetPasswordOtp : true},
            $inc : {__v : 1}
        }
    })

    return successResponse({
        res,
        status:200,
        message : "Password reset successfully",
    })
}

async function verifyGoogleAccount({idToken}){
    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload()
    return payload
}

export const loginWithGoogle = async(req,res,next)=>{
    const {idToken} = req.body
    const {email , email_verified , family_name , picture , given_name} = ticket.getPayload();
    await verifyGoogleAccount({idToken})

    if(!email_verified)
        return next(new Error("Email not verfied" , {cause : 401}))

    const user = await dbServices.findOne({
        model : userModel,
        filter : {email}
    })

    if(user){
    if(user.providers === providerEnum.GOOGLE){
        const accessToken = generateToken({
            payload : {
                id : user._id,
                email : user.email,
            } ,
            secretKey : process.env.TOKEN_ACCESS_SECRET , 
            options : {
                expiresIn : parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN),
                issuer : "http://localhost:3000",
                audience : "http://localhost:5000",
                jwtid : uuid(),
            }
        })

        const refreshToken = generateToken({
            payload : {id : user._id , email : user.email} ,
            secretKey : process.env.TOKEN_REFRESH_SECRET , 
            options : {
                expiresIn : parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN),
                jwtid : uuid()
            }
        })

        return successResponse({
            res,
            status : 200,
            message : "User Login Successfully",
            data : {accessToken , refreshToken}
        })
        }
    }

    const newUser = await dbServices.create({
        model : userModel,
        data : [{
            firstName : given_name,
            lastName : family_name , 
            email,
            confirmEmail : Date.now(),
            providers : providerEnum.GOOGLE
        }]
    })

    const accessToken = generateToken({
        payload : {
            id : newUser._id,
            email : newUser.email,
        } ,
        secretKey : process.env.TOKEN_ACCESS_SECRET , 
        options : {
            expiresIn : parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN),
            issuer : "http://localhost:3000",
            audience : "http://localhost:5000",
            jwtid : uuid(),
        }
    })

    const refreshToken = generateToken({
        payload : {id : newUser._id , email : newUser.email} ,
        secretKey : process.env.TOKEN_REFRESH_SECRET , 
        options : {
            expiresIn : parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN),
            jwtid : uuid()
        }
    })
    
    return successResponse({
        res,
        status:200,
        message : "Login successfully",
        data : {accessToken , refreshToken}
    })
}