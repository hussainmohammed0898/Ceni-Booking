import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
          },
          movie: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Movie',
            required: true
          },
          rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
          },
          review: {
            type: String,
            default : null,
        },
        date: {
            type: Date,
            default: Date.now,
        },
    },
    {timestamps:true}
);

const Review = mongoose.model("Review", reviewSchema);

export default Review