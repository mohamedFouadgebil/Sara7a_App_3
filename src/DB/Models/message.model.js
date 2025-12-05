import mongoose , {Schema} from "mongoose";

const messageSchema = new Schema(
    {
        content : {
            type : String,
            required : true,
            trim : true,
            minLength : [2 , "Message must be at least 2 characters"],
            maxLength : [500 , "Message must be at most 500 characters"]
        },
        receiverId : {
            type : mongoose.Schema.Types.ObjectId,
            required : true,
            ref : "User"
        }
    } , 
    {
        timestamps : true
    }
)

const messageModel = mongoose.models.Message || mongoose.model("Message" , messageSchema)
export default messageModel