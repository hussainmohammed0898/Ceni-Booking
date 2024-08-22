import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    show: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show',
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
    seats: [
      {
        row: String,
        number: Number,
        _id: false // Exclude `_id` for subdocuments if not needed
      }
    ],
    count: {
      type: Number,
      required: true
    },
    totalAmount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['booked', 'cancelled'],
      default: 'booked'
    },
    // Payment-related fields
    razorpay_order_id: {
      type: String,
      required: true
    },
    razorpay_payment_id: {
      type: String,
      required: true
    },
    razorpay_signature: {
      type: String,
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Failed'],
      default: 'Paid'
    }
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
