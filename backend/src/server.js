import express from 'express';
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoute from './routes/auth.route.js';
import { connectDB } from './lib/db.js';
import userRoutes from './routes/user.route.js';
import chatRoutes from './routes/chat.route.js';


// import dotenv from "dotenv";
// dotenv.config();
const app = express();
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true//allow frontend to send cookies
}))
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT;

app.use('/api/auth',authRoute);
app.use('/api/users',userRoutes);
app.use('/api/chat',chatRoutes);



app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
    connectDB();
})