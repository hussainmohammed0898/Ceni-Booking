import Booking from "../models/bookingModel.js";

export const viewBookingbyUser = async (req, res) => {
    try {
        const userId = req.user.data;
        const bookings = await Booking.find({ userId }).populate({
          path: 'showId',
          populate: [
            { path: 'movieId', select: 'title' },
            { path: 'theater', select: 'name' }
          ]
        });
    
        const bookingDetails = bookings.map(booking => {
          try {
            const showDate = new Date(booking.showId.showDate);
            const formattedDate = format(showDate, "yyyy-MM-dd");
            const formattedTime = format(showDate, "h:mm a");
            return {
              id: booking._id,
              movieId : booking.showId.movieId._id,
              movieName: booking.showId.movieId.title,
              theaterName: booking.showId.theater.name,
              showDate: formattedDate,
              showTime: formattedTime,
              seats: booking.seats,
              price: booking.showId.price,
            };
          } catch (error) {
            console.error('Error processing booking:', error);
            return null;
          }
        });
        res.status(200).json(bookingDetails.filter(Boolean));
      } catch (error) {
        console.error('Error getting bookings:', error);
        res.status(500).send({ success: false, message: 'Internal server error' });
      }
    };