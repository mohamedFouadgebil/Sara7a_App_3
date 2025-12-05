import express from "express";
import bootstrap from "./src/app.controller.js";
import dotenv from "dotenv"
import chalk from "chalk";
dotenv.config({path : "./src/config/.env.dev"})

const app = express();
const port = process.env.PORT || 5000;

bootstrap(express , app);

app.listen(port , ()=>{
    console.log(chalk.bgGreen.black(` Server is running on http://localhost:${port}`));
})
