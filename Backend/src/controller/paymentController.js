import razorpayInstance from "../config/razorPayInstance.js";
import crypto from "crypto";
import { StatusCodes } from "http-status-codes";
import Booking from "../models/bookingModel.js";
import dotenv from "dotenv";

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
    console.log("very hitted");

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, showId, seats, totalPrice } = req.body;
    const userId = req.user.data;
    console.log('NEW:',userId);
    
  
    console.log("Razorpay Order ID:", razorpay_order_id);
    console.log("Razorpay Payment ID:", razorpay_payment_id);
    console.log("Razorpay Signature:", razorpay_signature);
  
  
    try {
      const sign = razorpay_order_id + "|" + razorpay_payment_id;
  
      // secret_key - random bytes
      const expectedSign = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET || "s")
        .update(sign.toString())
        .digest("hex");
  
      console.log(razorpay_signature === expectedSign);
  
      const isAuthentic = expectedSign === razorpay_signature;
      console.log("ok", isAuthentic);
      if (isAuthentic) {
        const { showId, seats, totalPrice } = req.body;
        
        const payment = new Booking({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            show:showId,
            userId,
            seats,
            totalAmount:totalPrice,
            paymentStatus: 'Paid',
            bookingDate: new Date(),
        });
  
        await payment.save();
  
        res.json({
          message: "Payement Successfully",
        });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error!" });
      console.log(error);
    }

};


   
