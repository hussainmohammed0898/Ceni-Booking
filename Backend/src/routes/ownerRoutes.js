import express from 'express';
import { addOwner, checkOwner, forgotPassword, ownerLogin, ownerLogout, resetPassword } from '../controller/ownerController.js';
import authenticateOwner from '../middleware/ownerMiddleware.js';
import { allMovies,  selectMovie, totalMovies } from '../controller/movieController.js';
import { AddTheater, selectTheater, TheaterByOwner } from '../controller/theatreController.js';
import { addShow, getShowByOwner } from '../controller/showController.js';
import { getDashboardStats } from '../controller/dashboardController.js';
const ownerRoute = express.Router();

ownerRoute.post("/register",addOwner);
ownerRoute.post("/login", ownerLogin);
ownerRoute.post('/forgot-password',forgotPassword);
ownerRoute.post('/reset-password/:id/:token',resetPassword);
ownerRoute.post("/logout", ownerLogout);
ownerRoute.post('/add-theater',authenticateOwner,AddTheater );
ownerRoute.post('/add-shows', addShow);
ownerRoute.get('/select-movie', authenticateOwner,selectMovie);
ownerRoute.get('/select-theater',authenticateOwner,selectTheater)
ownerRoute.get('/check-owner',authenticateOwner,checkOwner);
ownerRoute.get('/get-shows', authenticateOwner,getShowByOwner)
ownerRoute.get('/all-movies',authenticateOwner,allMovies);
ownerRoute.get('/total-movies',authenticateOwner,totalMovies);
ownerRoute.get('/my-theaters', authenticateOwner, TheaterByOwner)
ownerRoute.get('/dashboardStats',authenticateOwner, getDashboardStats);



export default ownerRoute
