import express from 'express'
import upload from '../middleware/uploadMiddleware.js';
import { addMovies, allMovies, deleteMovieById,  MovieDetails,  totalMovies } from '../controller/movieController.js';
import authenticateAdmin from '../middleware/adminMiddleware.js';
import { checkAdmin } from '../controller/ownerController.js';
import { approveTheater, getApprovedTheaters, notApprovedTheaters, totalTheaters } from '../controller/theatreController.js';
import { totalReviews } from '../controller/reviewController.js';
import { totalUser } from '../controller/userController.js';
import { adminDashboard } from '../controller/dashboardController.js';



const adminRouter = express.Router();


adminRouter.post("/add-movies", upload.single('image'),addMovies);
adminRouter.get('/all-movies',authenticateAdmin,allMovies);
adminRouter.delete('/delete-movie/:id',authenticateAdmin, deleteMovieById);
adminRouter.put('/approve-theaters/:id', authenticateAdmin, approveTheater);
adminRouter.get('/not-approved-theaters',authenticateAdmin,notApprovedTheaters)
adminRouter.get('/approved-theaters', authenticateAdmin,getApprovedTheaters);
adminRouter.get('/total-theater', authenticateAdmin, totalTheaters);
adminRouter.get('/check-admin',authenticateAdmin,checkAdmin);
adminRouter.get('/total-review',authenticateAdmin,totalReviews);
adminRouter.get('/total-movies',authenticateAdmin,totalMovies);
adminRouter.get('/total-users',authenticateAdmin,totalUser);
adminRouter.get('/adminDashboard',authenticateAdmin,adminDashboard);
adminRouter.get('/movie-details/:id',authenticateAdmin,MovieDetails);



export default adminRouter;