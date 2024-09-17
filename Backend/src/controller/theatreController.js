import { StatusCodes } from "http-status-codes";
import Theater from "../models/theaterModel.js";
import nodemailer from 'nodemailer';
import serverConfig from "../config/serverConfig.js";

export const AddTheater = async (req, res) => {
    const ownerId = req.owner.data;
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

export const approveTheater = async (req, res) => {
    console.log("hitting");
    
    try {
        const theaterId = req.params.id;
        console.log("id:",theaterId);

        const theater = await Theater.findByIdAndUpdate(theaterId, { approved: true }, { new: true }).populate('owner', 'email');;
        console.log("theater", theater);
        
        
        if (!theater) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Theater not found" });
        }

        if (theater.owner && theater.owner.email) {
            var transporter = nodemailer.createTransport({
                service: serverConfig.service,
                auth: {
                  user: serverConfig.email,
                  pass: serverConfig.password
                }
              });
              
              var mailOptions = {
                from: serverConfig.email,
                to: theater.owner.email,
                subject: 'Theater Approved',
                text: `Dear Theater Owner,\n\nYour theater has been approved by the admin.\n\nBest regards,\nYour Team`,
              };
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  return res.status(StatusCodes.OK).json({Status: "Success"})
                }
              });

        }

        
        res.status(StatusCodes.OK).json({ message: "Theatre approved successfully" });
    }
    catch (error) {
        console.log("Error in approve theater controller", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
    }
};

export const notApprovedTheaters = async (req, res) => { 
    try {
        
        const theaters = await Theater.find({approved : false}).populate('owner', 'name');
        res.status(StatusCodes.OK).json(theaters);
    }
    catch (error) {
        console.log("Error in theaters controller", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
    }
};

export const getApprovedTheaters = async (req, res) => {
    try {
        const theaters = await Theater.find({ approved: true }).populate('owner', 'name');
        res.status(StatusCodes.OK).json(theaters);
    }
    catch (error) {
        console.log("Error in theaters controller", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
    }

};

export const totalTheaters = async (req, res) => {
    try {
        const approved = await Theater.find({ approved: true });
        const pending = await Theater.find({ approved: false });

        res.status(StatusCodes.OK).json({ approvedTheater: approved.length, pendingTheater: pending.length });
    } catch (error) {
        console.error('Error fetching total theaters:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
}

export const selectTheater = async (req, res) => { 
    try {
        const ownerId = req.owner.data;
        const theaters = await Theater.find( { owner : ownerId ,approved: true }).select('name').select('location');
        res.status(StatusCodes.OK).json(theaters);
    } catch (error) {
        console.error("Error fetching theaters", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
    }
}

export const TheaterByOwner = async (req, res) => {
    const ownerId = req.owner.data;
    try {
        const theaters = await Theater.find({ owner: ownerId });
        if (theaters.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "No theaters found for this owner" });
        }
        res.status(StatusCodes.OK).json(theaters);
        
    } catch (error) {
        console.log("Error in get theaters controller", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
    }
}




  
