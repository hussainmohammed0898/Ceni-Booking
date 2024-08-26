import React from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { createOrder, handlePayment } from '../config/razorpayment.js';
import { baseUrl } from '../URL/baseUrl.js';



function ShowSeats() {
 const [seats, setSeats] = useState([]);
 const [price, setPrice] = useState(0);
 const [selectedSeats, setSelectedSeats] = useState([]);
 const [loading, setLoading] = useState(false);
 const { showId } = useParams();
 const navigate = useNavigate();
    


    useEffect(() => {
        const fetchSeatingPattern = async () => {
          try {
            const response = await axios.get(`${baseUrl}/api/user/show-seats/${showId}`, { withCredentials: true });
            console.log("show",response.data);
            setSeats(response.data.showSeating);
            setPrice(response.data.price);
          } catch (error) {
            console.error('Error fetching seating pattern:', error);
          }
        };
    
        fetchSeatingPattern();
      }, [showId]);
      
     
      
      

      const handleSeat = (rowIndex, seatIndex) => {
        const newSeats = [...seats];
        const seat = newSeats[rowIndex][seatIndex];
        let newSelectedSeats = [...selectedSeats];
      
        if (seat.status === 'available') {
          if (newSelectedSeats.length < 10) {
            seat.status = 'selected';
            newSelectedSeats = [...newSelectedSeats, { row: seat.row, number: seat.number }];
          } else {
            toast.error('You can only book up to 10 seats at a time.');
          }
        } else if (seat.status === 'selected') {
          seat.status = 'available';
          newSelectedSeats = newSelectedSeats.filter(selectedSeat => selectedSeat.number !== seat.number);
        }
      
        setSeats(newSeats);
        setSelectedSeats(newSelectedSeats);
      };
    
      const handleBooking = async () => {
        try {
          setLoading(true);
          if (selectedSeats.length === 0) {
            toast.error('Please select a seat to book.');
            setLoading(false); 
            return;
          }
          
          const order = await createOrder(selectedSeats.length * price, selectedSeats, showId);
          setLoading(false)
          handlePayment(order, async (paymentId, razorpay_signature) => {
            const bookingData = {
              showId,
              seats: selectedSeats.map(seat => ({
                row: seat.row,
                number: seat.number,
                status: 'booked'
              })),
              totalPrice: selectedSeats.length * price,
              razorpay_payment_id: paymentId,
              razorpay_signature,
              razorpay_order_id: order.id,
            };
            
            try {
              const response = await axios.post(`${baseUrl}/api/user/verify-payment`, bookingData, { withCredentials: true });
              console.log("respone:", response);

              
              console.log("selectd seats:",selectedSeats);
              
    
              if (response.status === 200) {
                const updatedSeats = seats.map(row => 
                  row.map(seat => {
                    const isSelected = selectedSeats.find(
                      selectedSeat => selectedSeat.row === seat.row && selectedSeat.number === seat.number
                    );
                    return isSelected ? { ...seat, status: 'booked' } : seat;
                  })
                );
      
                setSeats(updatedSeats);
                setSelectedSeats([]);
                toast.success('Booking successful!');
                navigate('/bookings');
              } else {
                toast.error('Booking failed. Please try again.');
              }
            } catch (error) {
              if (error.response && error.response.status === 400) {
                toast.error(error.response.data.message);
              } else {
                console.error('Error during booking:', error);
                toast.error('Booking failed. Please try again.');
              }
            } finally {
              setLoading(false); 
            }
          });
        } catch (error) {
          console.error('Error during booking:', error);
          if (error.response && error.response.status === 400) {
            toast.error(error.response.data.message);
          } else {
            console.error('Error during booking:', error);
            toast.error('Booking failed. Please try again.');
          }
          setLoading(false); 
        }
      };

        
      const seatNumbers = seats.flatMap((row) =>
        row.map((seat) => seat.number)
    );
    const lastSeatNumber = seatNumbers[seatNumbers.length - 1];

   
  
  return (
    <div className="container mx-auto px-5 pt-5">
    <h1 className="text-2xl font-bold text-center mb-4">Select Your Seats</h1>
    <div className="flex justify-center items-center h-[70vh] overflow-x-auto animate-fade-in">
    <div className="mt-5 gap-4 grid "  style={{ gridTemplateColumns: `repeat(${lastSeatNumber}, minmax(50px, 1fr))` }}>
                {seats.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex flex-row justify-center">
                        {row.map((seat, seatIndex) => (
                            <div
                                key={seatIndex}
                                className={`p-2 border rounded text-center cursor-pointer text-white
                                  ${seat.status === 'booked' || seat.status === 'reserved' ? 'bg-red-500' : seat.status === 'selected' ? 'bg-yellow-500' : 'bg-green-500'}
                        ${seat.status === 'booked' || seat.status === 'reserved'}`}
                      style={{ cursor: seat.status === 'booked' || seat.status === 'reserved' ? 'default' : 'pointer' }}
                      onClick={() => (seat.status === 'available' || seat.status === 'selected') && handleSeat(rowIndex, seatIndex)}
                    >
                                {seat.row}{seat.number}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
 
    </div>
    <div className="flex justify-center my-3">
        <span className="font-mono">SCREEN THIS WAY</span>
    </div>
    <div className="flex justify-evenly">
        <div className="flex flex-col items-center">
            <div className="w-6 h-6 mr-1 lg:mr-5 lg:mb-5 rounded-md bg-green-500"></div>
            <span>Available</span>
        </div>
        <div className="flex flex-col items-center">
            <div className="w-6 h-6 mr-1 lg:mr-5 lg:mb-5 rounded-md bg-red-500"></div>
            <span>Booked</span>
        </div>
    </div>
    <div className="divider"></div>
      <div className="flex flex-row justify-between items-center mb-3">
        <h1 className='text-left text-sm md:text-xl lg:text-2xl mr-5'>Price:{price}rs</h1>
        <h1 className='text-left text-sm md:text-xl lg:text-2xl mr-5'>Total:{selectedSeats.length * price}  rs</h1>
        <button
         onClick={handleBooking}
          className="btn btn-warning w-28"disabled={loading}>{loading ? <span className='loading loading-spinner bg-primary '></span> : "Book Seat"}
        </button>
      </div>
</div>

  )
}

export default ShowSeats