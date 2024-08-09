import { StatusCodes } from "http-status-codes";
import Theater from "../models/theaterModel.js";

export const AddTheater = async (req, res) => {
    const ownerId = req.owner.ownerId;
    try {
        const { name, location,selectedSeats} = req.body;
        if (!name || !location || !ownerId || !selectedSeats) {
            return res.status(StatusCodes.NOT_ACCEPTABLE).json({ error: "All fields are required" });
        }
        const newTheatre = new Theater({
            name,
            location,
            owner : ownerId,
            seatingPattern : selectedSeats
        });
        await newTheatre.save();
        if (!newTheatre) {
            return res.json({message:"Theatre is not created"});
        }
        res.status(StatusCodes.CREATED).json({ message: "Theatre added successfully" });
    }
    catch (error) {
        console.log("Error in add theatre controller", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
    }
};