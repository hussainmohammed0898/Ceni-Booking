import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import { StatusCodes } from "http-status-codes";
import { generateToken } from "../utilities/generalToken.js";
import nodemailer from 'nodemailer';
import serverConfig from "../config/serverConfig.js";
import jwt from 'jsonwebtoken';
import Booking from "../models/bookingModel.js";
import Review from "../models/reviewModel.js";
import { api } from "../API/apiUrl.js";


export const signup = async (req, res)=>{
   try {
    
    const {email,name,password,confirmPassword} = req.body;

    if (
        !name &&
        name.trim() === "" &&
        !email &&
        email.trim() === "" &&
        !password &&
        password.trim() === ""&&
        !confirmPassword &&
        confirmPassword.trim() === ""
      ) {
        return res.status(StatusCodes.NOT_ACCEPTABLE).json({ message: "Invalid Inputs" });
      }

    const userExist = await User.findOne({email});

    if(userExist){
         return res.status(StatusCodes.UNAUTHORIZED).json({message:"user already exist"});
    }

    if (password !== confirmPassword) {
        return res.status(StatusCodes.NOT_ACCEPTABLE).json({ message: "Password and confirm password does not match" });
    }

    const saltRound = 10;
    const hashPassword = await bcrypt.hash(password, saltRound);

    const newUser = new User({
        name,
        email,
        password:hashPassword
    });

    const newUserCreated = newUser.save();

    if(!newUserCreated){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:"something went wrong"});
    };

    res.status(StatusCodes.CREATED).json({message:"signup successfully completed"});

   } catch (error) {
    console.log(error);
    return res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json(error.message || "internal server error");
    }
};

export const signin = async (req, res)=>{
   try {
    const {email, password} = req.body;
    if (!email && email.trim() === "" && !password && password.trim() === "") {
        return res.status(StatusCodes.NOT_ACCEPTABLE).json({ message: "Invalid Inputs" });
      }

    const user =await User.findOne({email});

    if(!user){
        return res.status(StatusCodes.UNAUTHORIZED).json({message:"user not found"});
    };

    const comparePassword = await bcrypt.compare(password, user.password);
    if(!comparePassword){
       return res.status(StatusCodes.NOT_ACCEPTABLE).json({message:"incorrect password"});
    }


    
    const token = generateToken(user);
    console.log(token);
    res.cookie("access_token", token, {httpOnly:true,  maxAge: 1 * 24 * 60 * 60 * 1000, sameSite:'None', secure:true});
    res.status(StatusCodes.CREATED).json({message:"login successfully completed",userId:user._id});  

   } catch (error) {
    console.log(error);
    return res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json(error.message || "internal server error");
   }
};

export const forgotPassword =async (req, res)=>{
 try {
 
  
  const {email} = req.body;
  if (!email) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Email is required' });
  }
  const user =await User.findOne({email});
  if(!user){
    return res.status(StatusCodes.NOT_FOUND).json({message:'user not found'});
  };

  const token = generateToken(user);
  var transporter = nodemailer.createTransport({
      service: serverConfig.service,
      auth: {
        user: serverConfig.email,
        pass: serverConfig.password
      }
    });
    
    var mailOptions = {
      from: serverConfig.email,
      to: user.email,
      subject: 'Reset Password Link',
      text: `${api}/reset-password/${user._id}/${token}`
    };
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        return res.status(StatusCodes.OK).json({Status: "Success"})
      }
    });
    
   
 } catch (error) {
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
  
 }
        
};

export const resetPassword = async (req, res)=>{
  console.log("hitting");
  
  const {id, token} = req.params
  const{newPassword} = req.body;
  console.log("Received ID:", id);
  console.log("Received token:", token);
  console.log("Received newPassword:", newPassword);
  try {
    const decoded = jwt.verify(token, serverConfig.token);
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    const user = await User.findByIdAndUpdate(id, { password: hashedPassword });
    
    if (user) {
      return res.status(StatusCodes.CREATED).json({ message: "Password reset is successfully completed" });
    } else {
      return res.status(StatusCodes.NOT_MODIFIED).json({ message: 'Failed to create new password' });
    }
  
    
  } catch (error) {
    if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
      return res.sendStatus(StatusCodes.FORBIDDEN);
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
  
};

export const logout = (req, res) => {
  try {
    res.clearCookie('access_token', { httpOnly: true, sameSite: 'None', secure: true });
    res.status(StatusCodes.OK).json({ message: 'Logged out successfully' });

  } catch (error) {
    console.error('Error logging out:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
  }
};

export const checkUser = async (req, res) => {
  const user = req.user;

  const findUser = await User.findOne({ _id : user.data});
  if (!findUser) {
    return res.json({ message: "authentication failed", success: false });
  }
  
  res.json({ message: "authenticateUser", success: true });
}    

export const getUser = async (req, res) => {
  try {
      const userId = req.user.data;
      const user = await User.findById(userId);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
    }
    const userData = {
      name: user.name,
      email: user.email,
    };
    res.json(userData);
    console.log('userData:', userData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }
};

export const  totalUser = async (req, res) => {
  try {
    const users = await User.find();
    const usersWithStats = await Promise.all(users.map(async user => {
      const bookings = await Booking.find({ userId: user._id });
      const reviews = await Review.find({ userId: user._id });
      return {
        ...user._doc,
        totalBookings: bookings.length,
        totalReviews: reviews.length
      };
    }));
    res.json(usersWithStats);
  } catch (error) {
    console.error('Error fetching users with stats:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }

};

export const google = async (req, res) => {
try{
    const { name, email } = req.body;

    console.log("name",name);
    console.log("email",email);
    


    let user = await User.findOne({ email });
    if(user){
      const token = generateToken(user);
      res.cookie("access_token", token, {
        httpOnly: true,
        maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
        sameSite: 'None',
        secure: process.env.NODE_ENV === 'production',
      });

    }else{
      const generatedPassword = 
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const hashedPassword = await bcrypt.hash(generatedPassword, 10);

     const newUser = new User({ 
        name:name,
        email,
        password: hashedPassword 
      });

      await newUser.save();

      const token = generateToken(newUser);
      res.cookie("access_token", token, {
        httpOnly: true,
        maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
        sameSite: 'None',
        secure: true,
      });

      return res.status(StatusCodes.CREATED).json({ message: "User registered and login successfully completed" });

    }
    const token = generateToken(user);
    console.log("token:",token);
    
    res.cookie("access_token", token, {
      httpOnly: true,
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
      sameSite: 'None',
      secure: true
    });

    return res.status(StatusCodes.OK).json({ message: "Login successfully completed", success:true});

  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong" });
  }
};
