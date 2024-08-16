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

  const ShowSchema = new mongoose.Schema({
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: true,
    },
    theater: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Theater',
        required: true
    },
    showDate: {
        type: Date,
        required: true
    },
    showSeating: [[SeatSchema]],
    price: {
        type: Number,
        required: true
    },
}
, { timestamps: true }
);


const Show = mongoose.model('Show', ShowSchema);

export default Show;