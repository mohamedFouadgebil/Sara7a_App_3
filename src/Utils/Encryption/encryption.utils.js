import crypto from "node:crypto"
import fs from "node:fs"

const ENCRYPTION_SECRET_KEY = Buffer.from("12345678901234567890123456789012")
const IV_LENGTH = Number(process.env.IV_LENGTH) || 16

export const encrypt = (plaintext)=>{
    const iv = crypto.randomBytes(IV_LENGTH)

    const cipher = crypto.createCipheriv(
        "aes-256-cbc",
        ENCRYPTION_SECRET_KEY,
        iv
    )

    let encrypted = cipher.update(plaintext , "utf8" , "hex")
    encrypted += cipher.final("hex")
    return iv.toString("hex") + ":" + encrypted 
}

export const decrypt = (encryptedData)=>{
    const [ivHex , ciphertext] = encryptedData.split(":")
    const iv = Buffer.from(ivHex , "hex")

    const decipher = crypto.createDecipheriv(
        "aes-256-cbc",
        ENCRYPTION_SECRET_KEY,
        iv
    )

    let decrypted = decipher.update(ciphertext , "hex" , "utf8")
    decrypted += decipher.final("utf8")
    return decrypted
}

if(fs.existsSync("publicKey.pem") && fs.existsSync("privateKey.pem")){
    console.log("Key already exists")
}
else{
    const {publicKey , privateKey} = crypto.generateKeyPairSync("rsa",
        {
            modulusLength : 2048 , 
            publicKeyEncoding : {type : "pkcs1" , format : "pem"},
            privateKeyEncoding : {type : "pkcs1" , format : "pem"}
        }
    )

    fs.writeFileSync("publicKey.pem" , publicKey)
    fs.writeFileSync("privateKey.pem" , privateKey)
}

export const asymmetricEncryption = (plaintext)=>{
    const bufferedData = Buffer.from(plaintext , "utf8")

    const encrypted = crypto.publicEncrypt(
        {
            key : fs.readFileSync("publicKey.pem" , "utf8") ,
            padding : crypto.constants.RSA_PKCS1_OAEP_PADDING
        } , 
        bufferedData
    )

    return encrypted.toString("hex")
}

export const asymmetricDecryption = (encryptedData)=>{
    const bufferedData = Buffer.from(encryptedData , "hex")

    const decrypted = crypto.privateDecrypt(
        {
            key : fs.readFileSync("privateKey.pem" , "utf8") ,
            padding : crypto.constants.RSA_PKCS1_OAEP_PADDING
        } , 
        bufferedData
    )

    return decrypted.toString("utf8")
}

