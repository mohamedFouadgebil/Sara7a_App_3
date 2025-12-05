import multer from "multer"
import path from "node:path"
import fs from "node:fs"
import { fileTypeFromBuffer } from "file-type";

export const fileValidationMagic = async (req, res, next) => {
    try {
        const file = req.file || (req.files && req.files[0]);
        if (!file) {
            return next(new Error("No file uploaded"));
        }
        const buffer = await fs.promises.readFile(file.path);
        const type = await fileTypeFromBuffer(buffer);
        const allowedTypes = ["image/jpeg", "image/png"];
        if (!type || !allowedTypes.includes(type.mime)) {
            return next(new Error("Invalid file type"));
        }
        return next();
    } catch (error) {
        return next(new Error(error.message || "Internal server error"));
    }
};

export const fileValidation = {
    images : ["image/png" , "image/jpeg" , "image/jpg"],
    videos : ["video/mp4" , "video/mj2" , "video/mpeg"],
    documentation : ["application/pdf" , "application/msword"],
    audios : ["audio/webm" , "audio/x-pn-realaudio-plugins"]
}

export const localUploadFile = ({customPath = "general" , validation = []})=>{
    const basePath = `Uploads/${customPath}`
    const storage = multer.diskStorage({
        destination : (req,file,cb)=>{
            let userBasePath = basePath;
            if(req.user?._id) userBasePath += `/${req.user._id}`
            const fullPath = path.resolve(`./src/${userBasePath}`)
            if(!fs.existsSync(fullPath)) fs.mkdirSync(fullPath , {recursive : true})
            cb(null , fullPath)
        },
        filename : (req,file,cb)=>{
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + "-" +file.originalname ;
            file.finalPath = `${basePath}/${req.user._id}/${uniqueSuffix}`
            cb(null , uniqueSuffix)
        } ,
    })

    const fileFilter = (req,file,cb)=>{
        if(validation.includes(file.mimetype)){
            return cb(null , true)
        }
        else{
            cb(new Error("Invalid File Type") , false)
        }
    }

    return multer({fileFilter,storage})
}