import express from "express";
import dotenv from "dotenv";
import {connectDB} from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";   
import cookieParser from "cookie-parser"; 
import messageRoutes from "./routes/message.route.js";
import cors from "cors";

dotenv.config();
const app = express();

const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin : "http://localhost:5173",
    credentials: true,
}))

app.use("/api/auth", authRoutes)
app.use("/api/message", messageRoutes)

app.listen(5001, () =>{
    console.log(`Server listening on port ${PORT}`);
    connectDB();
}) 