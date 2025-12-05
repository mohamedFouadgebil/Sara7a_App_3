import connectionDB from "./DB/connection.js";
import { globalError } from "./Utils/errorHandler.utils.js";
import authRouter from "./Modules/Auth/auth.controller.js"
import userRouter from "./Modules/User/user.controller.js"
import messageRouter from "./Modules/Message/message.controller.js"
import cors from "cors"
import path from "node:path"
import morgan from "morgan";
import { attachRouterWithLogger } from "./Utils/Logger/logger.utils.js";
import helmet from "helmet";
import { corsOption } from "./Utils/Cors/cors.utils.js"
import {rateLimit} from "express-rate-limit"

const bootstrap = async(express , app)=>{
    app.use("/Uploads" , express.static(path.resolve("./src/Uploads")))
    app.use(express.json({limit : "1kb"}));
    app.use(cors(corsOption()))
    app.use(helmet())
    
    const limiter = rateLimit({
        windowMs : 5*60*1000,
        limit : 5,
        message : {
            statusCode : 429,
            message : "Too many request , please try again later"
        },
        legacyHeaders : true
    }) 
    app.use(limiter)
    
    attachRouterWithLogger(app, "/api/v1/auth" , authRouter , "auth.log")
    attachRouterWithLogger(app, "/api/v1/user" , userRouter , "users.log")
    attachRouterWithLogger(app, "/api/v1/message" , messageRouter , "message.log")
    
    app.use("/api/v1/auth" , authRouter);
    app.use("/api/v1/user" , userRouter);
    app.use("/api/v1/message" , messageRouter);

    await connectionDB();

    app.all("/*dummy" , (req,res,next)=>{
        return res
        .status(404)
        .json({message : "Page not found"})
    })

    app.use(globalError);
}

export default bootstrap;