import joi from "joi"
import { genderEnum } from "../DB/Models/user.model.js"
import { Types } from "mongoose"

export const validate = (schema)=>{
    return (req,res,next)=>{
        const validationError = []
        for (const key of Object.keys(schema)) {
            const validationResult = schema[key].validate(req[key] , {abortEarly : false})

            if(validationResult.error){
                validationError.push({key , details : validationResult.error.details})
            }
        }
        if(validationError.length)
            return res
            .status(400)
            .json({
                message : "validation Error" , details : validationError
            })

            return next()
    }
}

export const generalField = {
    firstName: joi.string().trim().min(2).max(20),
    lastName: joi.string().trim().min(2).max(20),
    email: joi
        .string()
        .email({
        minDomainSegments: 2,
        maxDomainSegments: 5,
        tlds: { allow: ["com", "org", "net", "io"] },
        })
        .trim()
        .lowercase(),
    password: joi.string().min(8),
    confirm_email: joi.ref("password"),
    gender: joi
        .string()
        .valid(...Object.values(genderEnum))
        .default(genderEnum.MALE),
    phone: joi.string().pattern(/^01[0125][0-9]{8}$/),
    otp : joi.string(),
    id : joi.string().custom((value,helper)=>{
            return Types.ObjectId.isValid(value) || helper.message("Invalid ObjectId Format")
        }),
    file : {
        fieldname : joi.string(),
        originalname : joi.string(),
        encoding : joi.string(),
        mimetype : joi.string(),
        size : joi.number().positive(),
        destination : joi.string(),
        filename : joi.string(),
        finalPath : joi.string(),
        path : joi.string()
    }
}