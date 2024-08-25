import { StatusCodes } from "http-status-codes";
import Booking from "../models/bookingModel.js";



export const viewBooking = async (req, res) => {
  console.log("hitting");
  try {
    const userId = req.user.data;

   
    const bookings = await Booking.find({ userId })
      .populate({
        path: 'show',
        populate: [
          { path: 'movieId' },
          { path: 'theater', select: 'name' }
        ]
        
      })
      .exec();

    if (!bookings || bookings.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "No bookings found." });
    }

    res.json({
      message: "Bookings retrieved successfully.",
      bookings,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error!" });
    console.log(error);
  }
  
  
};
