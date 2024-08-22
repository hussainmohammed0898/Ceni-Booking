import axios from 'axios';
import toast from 'react-hot-toast';


export const createOrder = async (totalAmount,selectedSeats,showId) => {
    const response = await axios.post('http://localhost:3000/api/user/create-order', {totalAmount, selectedSeats,showId}, { withCredentials: true });
    console.log(response.data.order, 'order');
    return response.data.order;
    
  };

  export const handlePayment = async (order, callback) => {
    const response = await axios.get('http://localhost:3000/api/user/get-user', { withCredentials: true });
    const userData = response.data;
    
  
    const options = {
      
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Ceni Booking',
      description: 'Seat Booking',
      order_id: order.id,
      handler: function (response) {
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