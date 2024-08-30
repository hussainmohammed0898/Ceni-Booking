import express from 'express';
import { checkUser, forgotPassword, getUser, google, logout, resetPassword, signin, signup } from '../controller/userController.js';
import authenticateUser from '../middleware/userMiddleware.js';
import { allMovies, MovieDetails} from '../controller/movieController.js';
import { addReview } from '../controller/reviewController.js';
import { getShowsByDate, ShowSeats } from '../controller/showController.js';
import {  paymentOrder, verifyPayment } from '../controller/paymentController.js';
import { viewBooking } from '../controller/bookingController.js';

const userRouter = express.Router();


userRouter.post("/register",signup);
userRouter.post("/login",signin);
userRouter.post("/logout", logout);
userRouter.post("/forgot-password",forgotPassword);
userRouter.post('/reset-password/:id/:token', resetPassword);
userRouter.post("/google",google);
userRouter.get("/check-user",authenticateUser,checkUser);
userRouter.get('/movies',allMovies);
userRouter.get('/movie-details/:id',authenticateUser,MovieDetails);
userRouter.get('/show',authenticateUser, getShowsByDate)
userRouter.get('/show-seats/:showId', authenticateUser,ShowSeats)
userRouter.post('/add-review', authenticateUser, addReview)
userRouter.get("/get-user",authenticateUser,getUser);
userRouter.post("/create-order", authenticateUser, paymentOrder);
userRouter.post("/verify-payment", authenticateUser, verifyPayment); 
userRouter.get("/view-booking",authenticateUser,viewBooking);



export default userRouter

