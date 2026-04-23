import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import { app, server } from "./socket/socket.js"; 
import messageRoute from "./routes/message.route.js";
import reviewRoute from "./routes/review.route.js";

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
const corsOptions = {
    origin: ['http://localhost:5173', 'https://careerlink.vercel.app', 'http://100.94.122.76:5173', 'https://careerlink-iomp.vercel.app'], // Added Vercel deployed app link
    credentials: true
}
app.use(cors(corsOptions));

const PORT = process.env.PORT || 8000; 

app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/v1/message", messageRoute);
app.use("/api/v1/review", reviewRoute);
server.listen(PORT,()=>{
    connectDB();
    console.log(`Server running at port ${PORT}`);
})