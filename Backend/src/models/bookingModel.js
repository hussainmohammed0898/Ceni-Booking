import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
          },
          theater: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Theater',
            required: true
          },
          movie: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Movie',
            required: true
          },
          bookingDate: {
            type: Date,
            default: Date.now
          },
          seats: {
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Theater',
            required: true,
          },
          count:{
            type:Number,
            required:true
          },
          totalAmount: {
            type: Number,
            required: true
          },
          status: {
            type: String,
            enum: ['booked', 'cancelled'],
            default: 'booked',
         },
    },
    {timestamps:true}
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;