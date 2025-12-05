import bcrypt from "bcrypt"

export const hash = async({plaintext = "" , saltRound = process.env.SALT_ROUND})=>{
    return await bcrypt.hash(plaintext , Number(saltRound)) 
}

export const compare = async({plaintext = "" , hash = ""})=>{
    return await bcrypt.compare(plaintext , hash) 
}