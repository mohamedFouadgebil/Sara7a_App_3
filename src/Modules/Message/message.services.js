import * as dbServices from "../../DB/dbServices.js"
import messageModel from "../../DB/Models/message.model.js"
import userModel from "../../DB/Models/user.model.js"
import { successResponse } from "../../Utils/successResponse.utils.js"

export const sendMessage = async(req,res,next)=>{
    const {content} = req.body
    const {receiverId} = req.params

    const user = await dbServices.findById({
        model : userModel,
        id : receiverId,
    })

    if(!user)
        return next(new Error("User not found" , {cause : 404}))

    const message = await dbServices.create({
        model : messageModel,
        data : [{ content , receiverId : user._id }]
    })

    return successResponse({
        res,
        status : 201,
        message : "Message Sent Successfully",
        data : {message}
    })
}

export const allMessages = async(req,res,next)=>{
    const messages = await dbServices.find({
        model : messageModel,
        populate : [{path : "receiverId" , select : "firstName , lastName , email , -_id"}]
    })

    return successResponse({
        res,
        status : 200,
        message : "Message Fetched Successfully",
        data : {messages}
    })
}