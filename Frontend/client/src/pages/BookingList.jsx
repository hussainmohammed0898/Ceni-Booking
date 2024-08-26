import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { BookingSkeleton } from '../ui/Skeleton';
import Review from './Review';
import { baseUrl } from '../URL/baseUrl.js';

const ViewBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [selectedMovieName, setSelectedMovieName] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/user/view-booking`, { withCredentials: true });
        console.log("response", response.data);
        
        const { bookings } = response.data;
        console.log("Bookings Data:", bookings);

        const validBookings = bookings.filter(booking => {
          const showDate = booking.show?.showDate;
          console.log("showDate:", showDate);
          
          return showDate && !isNaN(new Date(showDate).getTime());
        });

        const sortedBookings = validBookings.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));
        setBookings(sortedBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleOpenModal = (movieId, movieName) => {
    setSelectedMovieId(movieId);
    setSelectedMovieName(movieName);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMovieId(null);
    setSelectedMovieName(null);
  };

  return (
    <div className="min-h-screen p-4 ">
      <h1 className="text-3xl font-bold mb-6 text-center">Booking List</h1>
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="w-full max-w-4xl rounded-lg mx-auto">
              <BookingSkeleton />
            </div>
          ))}
        </div>
      ) : (
        <div className=" space-y-4 px-1 md:px-28 pt-5">
          {bookings.map((booking) => (
            <div className="card card-side bg-base-300  shadow-xl">
            <figure>
              <img
                src={booking.show?.movieId?.image}
                alt="Movie" 
                className=' md:h-56 ml-3'
                />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{booking.show?.movieId?.title}</h2>
              <span className=" text-clip w-2/4 md:w-32 text-sm font-bold">
   {booking.show?.showDate ? format(new Date(booking.show?.showDate), "d MMMM yyyy") : 'N/A'}</span>
   <div className="w-full md:w-auto +lg:w-1/2">
   <span className="font-semibold">Booking ID: </span>
   <span>{booking._id}</span>
   </div>
   <div className=" w-full md:w-auto  lg:w-1/2">
   <span className="font-semibold">Theater: </span>
   <span>{booking.show?.theater?.name || 'N/A'}</span>
 </div>
 <div className="w-full md:w-auto mb-2 lg:w-1/2">
   <span className="font-semibold">Show Date: </span>
   <span>{booking.show?.showDate ? new Date(booking.show?.showDate).toLocaleDateString() : 'N/A'}</span>
 </div>
 <div className="w-full md:w-auto mb-2 lg:w-1/2">
   <span className="font-semibold">Booked Seats: </span>
   <span>{booking.seats ? booking.seats.join(', ') : 'No booked seats'}</span>
 </div>
              <div className="card-actions justify-end">
              {booking.show?.showDate && (
     <button onClick={() => handleOpenModal(booking.show?.movieId, booking.show?.movieName)} className="btn btn-success text-primary-content">Add Review</button>
   )}
              </div>
            </div>
          </div>
           
          ))}
        </div>
      )}
      <Review isOpen={showModal} onClose={handleCloseModal} movieId={selectedMovieId} movieName={selectedMovieName} />
    </div>
  );
};

export default ViewBooking;
