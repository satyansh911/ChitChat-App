import express from "express";
import dotenv from "dotenv";
import {connectDB} from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";   
import cookieParser from "cookie-parser"; 
import messageRoutes from "./routes/message.route.js";
import cors from "cors";
import { app, server} from "./lib/socket.js";
import path from "path";

dotenv.config();


const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

app.use(express.json({ limit : "50mb"}));
app.use(express.urlencoded({ limit : "50mb", extended: true}));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin : ["http://localhost:5173","https://chitchat-vvxt.onrender.com"],
    credentials: true,
}))

app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)

if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req,res)=>{
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    })
}

server.listen(5001, () =>{
    console.log(`Server listening on port ${PORT}`);
    connectDB();
}) 