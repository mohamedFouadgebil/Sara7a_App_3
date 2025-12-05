import multer from "multer"

export const cloudUploadFile = ({customPath = "general" , validation = []})=>{
    const storage = multer.diskStorage({})

    const fileFilter = (req,file,cb)=>{
        if(validation.includes(file.mimetype)){
            cb(null , true)
        }
        else{
            cb(new Error("Invalid File Type") , false)
        }
    }

    return multer({fileFilter,storage})
}