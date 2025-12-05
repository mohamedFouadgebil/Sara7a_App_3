export const successResponse = async({
    res,
    status = 200 ,
    message = "Done",
    data = {}
})=>{
    return res
    .status(status)
    .json({message , data})
}