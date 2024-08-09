import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique:true,
        },
        password: {
            type:String,
            required: true,
            minLength:6,
        },
        resetPasswordToken: String,
        resetPasswordExpires: Date,
        role: {
            type: String,
            enum: ['user'],
            
        },
        bookings: [{ type: mongoose.Types.ObjectId, ref: "Booking" }],
    },
    {timestamps:true}
);

const User = mongoose.model("User", userSchema);

export default User;