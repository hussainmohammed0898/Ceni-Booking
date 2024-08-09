import express from 'express';
import serverConfig from './src/config/serverConfig.js';
import connectDataBase from './src/config/dbConfig.js';
import userRouter from './src/routes/userRoutes.js';
import ownerRoute from './src/routes/ownerRoutes.js';
import cookieParser from 'cookie-parser';
import adminRouter from './src/routes/adminRoutes.js';
import cors from 'cors';





const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from your frontend
    credentials: true,

  }));

app.use("/api/user", userRouter);
app.use("/api/owner", ownerRoute);
app.use("/api/admin",adminRouter);




app.listen(serverConfig.port, ()=>{
    console.log(`server running on ${serverConfig.port}`);
    connectDataBase();
})