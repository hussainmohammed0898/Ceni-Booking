import razorpayInstance from "../config/razorPayInstance.js";
import crypto from "crypto";
import { StatusCodes } from "http-status-codes";
import Booking from "../models/bookingModel.js";
import dotenv from "dotenv";
import Show from "../models/showModel.js";

dotenv.config();

export const paymentOrder =async (req, res)=>{
    console.log("hitting");
    
    const {totalAmount } = req.body;
    console.log("Request body:", req.body);
    console.log("Total Amount:", totalAmount);
    
   
    

    try {
        if (!totalAmount || isNaN(totalAmount)) {
            return res.status(400).json({ message: "Invalid amount" });
        }
        const options = {
            amount: Number(totalAmount) * 100, 
          currency: "INR",
          receipt: crypto.randomBytes(10).toString("hex"),
        };
      
        
        const order = await razorpayInstance.orders.create(options);
        
        res.status(StatusCodes.OK).json({ data: order });
      } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error!" });
        console.log(error);
      }


}

export const verifyPayment = async (req, res) => {
  console.log("Payment verification triggered.");

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, showId, seats, totalPrice } = req.body;
  const userId = req.user.data;
  
  try {
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET || "s")
      .update(sign.toString())
      .digest("hex");

    const isAuthentic = expectedSign === razorpay_signature;
    
    if (isAuthentic) {
      // Save booking information
      const payment = new Booking({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        show: showId,
        userId,
        seats,
        totalAmount: totalPrice,
        paymentStatus: 'Paid',
        bookingDate: new Date(),
      });

      await payment.save();

      // Update seat statuses
      const show = await Show.findById(showId);
      
      seats.forEach(selectedSeat => {
        show.showSeating.forEach(row => {
          row.forEach(seat => {
            if (seat && seat.row === selectedSeat.row && seat.number === selectedSeat.number) {
              seat.status = 'booked';
              console.log(`Seat ${seat.row}${seat.number} status updated to 'booked'`);
            }
          });
        });
      });

      await show.save();

      res.status(200).send({ success: true, message: 'Booking successful', booking: payment });
    } else {
      res.status(400).json({ message: "Payment verification failed." });
    }
  } catch (error) {
    console.error("Error during payment verification:", error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};