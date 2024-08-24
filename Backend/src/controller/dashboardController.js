import { StatusCodes } from "http-status-codes";
import Booking from "../models/bookingModel.js";
import Movie from "../models/moviesModel.js";
import Show from "../models/showModel.js";
import Theater from "../models/theaterModel.js";

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