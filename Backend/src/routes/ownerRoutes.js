import express from 'express';
import { addOwner, checkOwner, ownerLogin, ownerLogout } from '../controller/ownerController.js';
import authenticateOwner from '../middleware/ownerMiddleware.js';
import { Movies, totalMovies } from '../controller/movieController.js';
import { AddTheater } from '../controller/theatreController.js';
const ownerRoute = express.Router();

ownerRoute.post("/register",addOwner);
ownerRoute.get("/login", ownerLogin);
ownerRoute.post("/logout", ownerLogout);
ownerRoute.post('/add-theater',authenticateOwner,AddTheater );
ownerRoute.get('/check-owner',authenticateOwner,checkOwner);
ownerRoute.get('/all-movies',authenticateOwner,Movies);
ownerRoute.get('/total-movies',authenticateOwner,totalMovies);


export default ownerRoute
