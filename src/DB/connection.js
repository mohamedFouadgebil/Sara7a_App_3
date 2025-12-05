import mongoose from "mongoose";

const connectionDB = async()=>{
    try {
        await mongoose.connect(process.env.URI)
        console.log(`DataBase Connected Successfully`);
    } catch (error) {
        console.log(`DataBase Failed To Connect`);
    }
}

export default connectionDB;