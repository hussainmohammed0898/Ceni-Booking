import axios from 'axios';
import toast from 'react-hot-toast';
import { baseUrl } from '../URL/baseUrl.js';


export const createOrder = async (totalAmount,selectedSeats,showId) => {
    const response = await axios.post(`${baseUrl}/api/user/create-order`, {totalAmount, selectedSeats,showId}, { withCredentials: true });
    console.log(response.data, 'ordersss');
    return response.data.data;

    
    
  };

  export const handlePayment = async (order, callback) => {
    const response = await axios.get(`${baseUrl}/api/user/get-user`, { withCredentials: true });
    console.log(response.data);
    
    const userData = response.data;

    if (!order || !order.amount || !order.id) {
      console.error('Order is missing required properties:', order);
      toast.error('Order creation failed, cannot proceed with payment.');
      return;
    }
    
  
    const options = {
      
      key:import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency || 'INR',
      name: 'Ceni Booking',
      description: 'Seat Booking',
      order_id: order.id,
        handler: function (response) {
          console.log("res",response);
          
          if (response.error) {
            toast.error(response.error.description);
          } else {
            callback(response.razorpay_payment_id,response.razorpay_signature);
          }
        },

      prefill: {
        name: userData.name,
        email:  userData.email,
        contact: ''
      },
      notes: {
        customer_name: userData.name,
      },
      theme: {
        color: '#f43f5e'
      }
    };
    console.log(options, 'options');
  
    const rzp1 = new window.Razorpay(options);
      rzp1.open();
      rzp1.on("payment.failed", function (response) {
        alert(response.error.code);
      });

  };