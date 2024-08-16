import mongoose from "mongoose";

const SeatSchema = new mongoose.Schema({
  row: {
    type: String,
    required: true,
 },
  number: {
    type: Number,
    required: true,
 },
   status: {
      type: String,
      enum: ['available', 'reserved', 'booked'],
      default: 'available'
  }
});
const TheaterSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true
  },
   location: {
      type: String,
      required: true
  },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Owner',
      required: true
  },
   seatingPattern: [[SeatSchema]],
   approved: {
    type: Boolean,
    default: false
},
  
},
{ timestamps: true }
);


const Theater = mongoose.model('Theater', TheaterSchema);

    export default Theater;
    
