import { StatusCodes } from "http-status-codes";
import Booking from "../models/bookingModel.js";
import Movie from "../models/moviesModel.js";
import Show from "../models/showModel.js";
import Theater from "../models/theaterModel.js";
import User from "../models/userModel.js";
import Review from "../models/reviewModel.js";

export const getDashboardStats = async (req, res) => {
    console.log("booking");
    
    try {
        const bookings = await Booking.find();
        const totalBookings = bookings.length;
        const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalAmount,0);
        const totalMovies = await Movie.countDocuments();
        const totalTheaters = await Theater.countDocuments();
        const totalShows = await Show.countDocuments();

        res.status(StatusCodes.OK).json({ totalBookings, totalRevenue, totalMovies, totalTheaters, totalShows });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
};

export const adminDashboard = async(req, res)=>{
    try {
        // Fetch total number of theaters
        const totalTheaters = await Theater.countDocuments();

        // Fetch total number of approved theaters
        const approvedTheaters = await Theater.countDocuments({ approved: true});

        // Fetch total number of pending theaters
        const pendingTheaters = await Theater.countDocuments({ approved: false });

        // Fetch total number of users
        const totalUsers = await User.countDocuments();

        // Fetch total number of movies
        const totalMovies = await Movie.countDocuments();

        // Fetch total number of reviews
        const totalReviews = await Review.countDocuments();

        // Send the stats as a response
        return res.status(200).json({
            success: true,
            data: {
                totalTheaters,
                approvedTheaters,
                pendingTheaters,
                totalUsers,
                totalMovies,
                totalReviews,
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard stats.',
        });
    }


}