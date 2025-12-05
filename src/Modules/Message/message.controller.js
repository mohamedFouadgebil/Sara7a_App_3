import { Router } from "express";
const router = Router()
import * as messageServices from "./message.services.js"
import { validate } from "../../Middleware/validation.middleware.js";
import { sendMessageSchema } from "./message.validation.js";

router.post("/send-message/:receiverId" , validate(sendMessageSchema) , messageServices.sendMessage)
router.get("/all-messages" , messageServices.allMessages)


export default router