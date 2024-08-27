import Review from "../models/reviewModel.js";
import { StatusCodes } from "http-status-codes";
import Movie from "../models/moviesModel.js";

export const addReview = async (req, res) => {
    try {
        console.log("Received request:", req.body);

        const { movieId, rating, review } = req.body;
        const userId = req.user?.data;

        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'User not authenticated' });
        }

        const newReview = new Review({
            movie: movieId,
            user: userId,
            rating,
            review,
        });

        const savedReview = await newReview.save();

        const updatedMovie = await Movie.findByIdAndUpdate(
            movieId,
            { $push: { reviews: savedReview._id } },
            { new: true }
        ).populate({
            path: 'reviews',
            populate: {
              path: 'user',
              select: 'name', 
            },
          });
        if (!updatedMovie) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Movie not found' });
        }

        res.status(StatusCodes.CREATED).json(savedReview);

    } catch (error) {
        console.error('Error creating review:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
};

export const totalReviews = async (req, res) => {

    try {
        const review = await Review.find();
        res.status(StatusCodes.OK).json({ totalReviews: review.length });
    } catch (error) {
        console.error('Error fetching total reviews:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
  }