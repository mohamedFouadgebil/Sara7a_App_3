import { verifyToken } from "../../Utils/Tokens/token.utils.js";
import * as dbServices from "../../DB/dbServices.js"
import userModel from "../../DB/Models/user.model.js";
import { successResponse } from "../../Utils/successResponse.utils.js";
import tokenModel from "../../DB/Models/token.model.js";
import path from "node:path"
import { cloudUploadFile } from "../../Utils/Multer/cloud.multer.js";
import { cloudinaryConfig } from "../../Utils/Multer/cloudinary.config.js";

export const listUsers = async(req,res,next)=>{
    const messages = await dbServices.find({
        model : userModel,
        populate : [{path : "messages" , select : "content -_id -receiverId"}]
    })

    return successResponse({
        res,
        status : 200,
        message : "Done",
        data : {messages}
    })
}

export const updateProfile = async(req,res,next)=>{
    const {firstName , lastName , phone} = req.body
    const {authorization} = req.headers;

    const decoded = verifyToken({
        token : authorization,
        secretKey : process.env.TOKEN_ACCESS_SECRET , 
    })

    const checkToken = await dbServices.findOne({
        model : tokenModel,
        filter : {jwtid : decoded.jti}
    })

    if(checkToken){
        return next(new Error("Token Revoked" , {cause : 500}))
    }

    const updateUser = await dbServices.findByIdAndUpdate({
        model : userModel,
        id : decoded.id,
        data :{firstName , lastName , phone}
    })

    return successResponse({
        res,
        status : 200,
        message : "User Updated Successfully",
        data : {updateUser}
    })
}

export const profileImage = async(req,res,next)=>{
    const user = await dbServices.findOneAndUpdate({
        model : userModel,
        filter : {_id : req.user._id},
        data : {profileImage : req.file.finalPath},
    })

    return successResponse({
        res,
        status : 200,
        message : "Image Updated Successfully",
        data : {user}
    })
}

export const profileImageCloud = async(req,res,next)=>{
    const {public_id , secure_url} = await cloudinaryConfig().uploader.upload(req.file.path , {
        folder : `Sara7a_App/Users/${req.user._id}`
    })

    const user = await dbServices.findOneAndUpdate({
        model : userModel,
        filter : {_id : req.user._id},
        data : {cloudProfileImage : {public_id , secure_url}},
    })

    if(req.user.cloudProfileImage?.public_id){
        await cloudinaryConfig().uploader.destroy(
            req.user.cloudProfileImage.public_id
        )
    }

    return successResponse({
        res,
        status : 200,
        message : "Image Updated Successfully",
        data : {user}
    })
}

export const coverImage = async(req,res,next)=>{
    const user = await dbServices.findOneAndUpdate({
        model : userModel,
        filter : {_id : req.user._id},
        data : {coverImages : req.files.map((file)=>file.finalPath)},
    })

    return successResponse({
        res,
        status : 200,
        message : "Image Updated Successfully",
        data : {user}
    })
}

export const coverImageUpload = async(req,res,next)=>{
    const attachment = []
    for (const file of req.files) {
        const {public_id , secure_url} = await cloudinaryConfig().uploader.upload(file.path , {
            folder : `Sara7a_App/Users/${req.user._id}`
        }
    )
        attachment.push({public_id , secure_url})
    }

    const user = await dbServices.findOneAndUpdate({
        model : userModel,
        filter : {_id : req.user._id},
        data : {CloudCoverImages : attachment},
    })

    return successResponse({
        res,
        status : 200,
        message : "Cover image updated successfully",
        data : {user}
    })
}

export const freezeAccount = async (req, res, next) => {
const { userId } = req.params;

if (userId && req.user.role !== roleEnum.ADMIN) {
    return next(new Error("You Are not authorized to freeze Account"));
}

const updatedUser = await dbServices.findOneAndUpdate({
    model: userModel,
    filter: {
        _id: userId || req.user._id,
        freezedAt: { $exists: false },
    },
    data: {
        freezedAt: Date.now(),
        freezedBy: req.user._id,
    },
});

return updatedUser
    ? successResponse({
        res,
        status: 200,
        message: "Profile Freezed Successfully",
        data: { user: updatedUser }
    })
    : next(new Error("User account not found or already frozen."));
};

export const restoreAccount = async (req, res, next) => {
    const { userId } = req.params;
    
    const updatedUser = await dbServices.findOneAndUpdate({
        model: userModel,
        filter: {
            _id: userId,
            freezedAt: { $exists: true },
            freezedBy: { $exists: true },
        },
        data: {
            $unset: {
                freezedAt: true,
                freezedBy: true,
            },
            restoredAt: Date.now(),
            restoredBy: req.user._id,
        },
    });

return updatedUser
    ? successResponse({
        res,
        statusCode: 200,
        message: "Profile Restored Successfully",
        data: { user: updatedUser }
    })
    : next(new Error("Invalid Account"));
};