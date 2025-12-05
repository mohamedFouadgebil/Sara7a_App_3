import mongoose , {Schema} from "mongoose";

export const genderEnum = {
    MALE : "MALE",
    FEMALE : "FEMALE"
}

export const providerEnum = {
    SYSTEM : "SYSTEM",
    GOOGLE : "GOOGLE"
}

export const roleEnum = {
    USER : "USER",
    ADMIN : "ADMIN"
}

const userSchema = new Schema(
    {
        firstName : {
            type : String,
            required : true,
            trim : true,
            minLength : [2 , "First name must be at least 2 characters"],
            maxLength : [20 , "First name must be at most 20 characters"]
        },
        lastName : {
            type : String,
            required : true,
            trim : true,
            minLength : [2 , "Last name must be at least 2 characters"],
            maxLength : [20 , "Last name must be at most 20 characters"]
        },
        email : {
            type : String,
            trim : true,
            lowercase : true,
            required : true,
            unique : true,
        },
        password : {
            type : String,
            required : function(){
            return providerEnum.GOOGLE ? false : true},
            minLength : [8 , "Password must be at least 8 characters"],
        },
        confirm_email : {
            type : Date
        },
        gender : {
            type : String,
            required : true,
            enum : {values : Object.values(genderEnum) , message : "{VALUE} is not supported"},
            default : genderEnum.MALE
        },
        providers : {
            type : String,
            required : true,
            enum : {values : Object.values(providerEnum) , message : "{VALUE} is not supported"},
            default : providerEnum.SYSTEM
        },
        role : {
            type : String,
            required : true,
            enum : {values : Object.values(roleEnum) , message : "{VALUE} is not supported"},
            default : roleEnum.USER
        },
        phone : {
            type : String,
        },
        confirmEmailOtp:{
            type : String ,
        },
        forgetPasswordOtp : {
            type : String
        },
        profileImage :{
            type :  String,
        },
        coverImages : { 
            type : [String]
        },
        cloudProfileImage :{
            type : {public_id : String , secure_url : String},
        },
        CloudCoverImages : { 
            type : [{public_id : String , secure_url : String}]
        },
        freezedAt : {
            type : Date
        },
        freezedBy : {
            type : mongoose.Schema.Types.ObjectId , ref : "User"
        },
        restoredAt : {
            type : Date
        },
        restoredBy : {
            type : mongoose.Schema.Types.ObjectId , ref : "User"
        },
    }
    ,
    {
        timestamps : true,
        toJSON : {virtuals : true},
        toObject : {virtuals : true}
    }
)

userSchema.virtual("messages" , {
    localField : "_id",
    foreignField : "receiverId",
    ref : "Message"
})

const userModel = mongoose.models.User || mongoose.model("User" , userSchema)
export default userModel;