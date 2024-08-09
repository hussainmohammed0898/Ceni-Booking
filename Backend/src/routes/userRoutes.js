import express from 'express';
import { checkUser, forgotPassword, getUser, google, logout, resetPassword, signin, signup } from '../controller/userController.js';
import authenticateUser from '../middleware/userMiddleware.js';
import { Movies } from '../controller/movieController.js';
import { verifyToken } from '../middleware/verifyGoogleToken.js';

const userRouter = express.Router();


userRouter.post("/register",signup);
userRouter.post("/login",signin);
userRouter.post("/logout", logout);
userRouter.post("/forgot-password",forgotPassword);
userRouter.post('/reset-password/:id/:token', resetPassword);
userRouter.post("/google",verifyToken,google);
userRouter.get("/check-user",authenticateUser,checkUser);
userRouter.get('/movies',Movies);
userRouter.get("/get-user",authenticateUser,getUser);



export default userRouter

