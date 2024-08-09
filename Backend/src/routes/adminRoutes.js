import express from 'express'
import upload from '../middleware/uploadMiddleware.js';
import { addMovies, deleteMovieById, Movies } from '../controller/movieController.js';
import authenticateAdmin from '../middleware/adminMiddleware.js';
import { checkAdmin } from '../controller/ownerController.js';



const adminRouter = express.Router();


adminRouter.post("/add-movies", upload.single('image'),addMovies);
adminRouter.get('/all-movies',authenticateAdmin,Movies);
adminRouter.delete('/delete-movie/:id',authenticateAdmin, deleteMovieById);
adminRouter.get('/check-admin',authenticateAdmin,checkAdmin)

export default adminRouter;