import joi from "joi";
import { generalField } from "../../Middleware/validation.middleware.js";
import { fileValidation } from "../../Utils/Multer/local.multer.js";

export const profileImageSchema = {
    file : joi.object({
        fieldname: generalField.file.fieldname.valid("profileImage").required(),
        originalname: generalField.file.originalname.required(),
        encoding: generalField.file.encoding.required(),
        mimetype: generalField.file.mimetype.valid(...fileValidation.images).required(),
        size: generalField.file.size.max(5*1024*1024).required(),
        destination: generalField.file.destination.required(),
        filename: generalField.file.fieldname.required(),
        finalPath: generalField.file.finalPath.required(),
        path: generalField.file.path.required(),
    }).required()
};

export const coverImageSchema = {
    files : joi.object({
        fieldname: generalField.file.fieldname.valid("profileImage").required(),
        originalname: generalField.file.originalname.required(),
        encoding: generalField.file.encoding.required(),
        mimetype: generalField.file.mimetype.valid(...fileValidation.images).required(),
        size: generalField.file.size.max(5*1024*1024).required(),
        destination: generalField.file.destination.required(),
        filename: generalField.file.fieldname.required(),
        finalPath: generalField.file.finalPath.required(),
        path: generalField.file.path.required(),
    }).required()
};

export const freezeAcountSchema = {
    params : joi.object({
        userId : generalField.id
    })
}

export const restoreAcountSchema = {
    params : joi.object({
        userId : generalField.id
    })
}