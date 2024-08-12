import Review from "../models/reviewModel.js";
import { StatusCodes } from "http-status-codes";
import Movie from "../models/moviesModel.js";

export const addReview =async (req, res)=>{
    try {
        const {movieId, rating, review} = req.body;
        const userId = req.user.data;

        const newReview = new Review ({
            movieId,
            userId,
            rating,
            review,
        });
        const saveReview = await newReview.save();
        res.status(StatusCodes.OK).json(saveReview);
        await Movie.findById(movieId,{
            $push: { reviews: saveReview._id }
        });
        
    } catch (error) {
        console.error('Error creating review', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:'Internal server error'})
        
    }

}

export const totalReviews = async (req, res) => {

    try {
        const review = await Review.find();
        res.status(StatusCodes.OK).json({ totalReviews: review.length });
    } catch (error) {
        console.error('Error fetching total reviews:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
  }