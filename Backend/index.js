import express from 'express';
import serverConfig from './src/config/serverConfig.js';
import connectDataBase from './src/config/dbConfig.js';
import userRouter from './src/routes/userRoutes.js';
import ownerRoute from './src/routes/ownerRoutes.js';
import cookieParser from 'cookie-parser';
import adminRouter from './src/routes/adminRoutes.js';
import cors from 'cors';
import { StatusCodes } from 'http-status-codes';





const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 
    // 'http://localhost:5173',
    ['https://ceni-booking-frontend.onrender.com','https://cine-booking-admin.onrender.com'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    credentials: true,

  }));

app.use("/api/user", userRouter);
app.use("/api/owner", ownerRoute);
app.use("/api/admin",adminRouter);
app.all("*", (req, res)=>{
  res.status(StatusCodes.NOT_FOUND).json({message:"End point does not found"})
})




app.listen(serverConfig.port, ()=>{
    console.log(`server running on ${serverConfig.port}`);
    connectDataBase();
})