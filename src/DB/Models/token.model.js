import mongoose , {Schema} from "mongoose";

const tokenSchema = new Schema(
    {
        jwtid : {
            type : String,
            required : true,
            unique : true
        },
        expiresIn : {
            type : Date,
            required : true,
        },
        userId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        }
    },
    {
        timestamps : true
    }
)

const tokenModel = mongoose.models.tokenModel || mongoose.model("Token" , tokenSchema)
export default tokenModel