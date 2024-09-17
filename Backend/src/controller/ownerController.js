import Owner from "../models/ownerModel.js";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import nodemailer from 'nodemailer';
import { adminGenerateToken } from "../utilities/generalToken.js";
import serverConfig from "../config/serverConfig.js";
import jwt from 'jsonwebtoken';
import { ownerApi } from "../API/apiUrl.js";


export const addOwner = async (req, res)=>{
   try {
    const {name, email, password,confirmPassword} = req.body;

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

    const OwnerExist = await Owner.findOne({email});
    if(OwnerExist){
        return res.status(StatusCodes.NOT_ACCEPTABLE).json({message:"owner already exist"});
    };

    const saltRound = 10;
    const hashPassword = await bcrypt.hash(password, saltRound);

    const newOwner = new Owner({
        name,
        email,
        password:hashPassword,
        role: 'owner'
    });

    const newOwnerCreated = newOwner.save();

    if(!newOwnerCreated){
        res.status(StatusCodes.CONFLICT).json("something went wrong");
    };
    res.status(StatusCodes.CREATED).json("signup successfully completed");
   } catch (error) {
    console.log(error);
    return res.status(error.status || 500).json(error.message || "internal server error");
   }
};

export const ownerLogin =async(req, res)=>{
   try {
    const {email, password} = req.body;
    if (!email && email.trim() === "" && !password && password.trim() === "") {
        return res.status(StatusCodes.NOT_ACCEPTABLE).json({ message: "Invalid Inputs" });
      }


    const ownerExist = await Owner.findOne({email});
    if(!ownerExist){
        return res.status(StatusCodes.NOT_FOUND).json({message:"owner not found"});
    }
    
    const comparePassword = await bcrypt.compare(password, ownerExist.password);
    
    if(!comparePassword){
        return res.status(StatusCodes.NOT_ACCEPTABLE).json({message:"password incorrect"});
    };

    const token = adminGenerateToken(ownerExist);
    
    
   
    res.cookie('access_token',token,{httpOnly:true,  maxAge: 1 * 24 * 60 * 60 * 1000, sameSite:'None', secure:true})
    res.status(StatusCodes.ACCEPTED).json({message:"login successfully completed", role:ownerExist.role});  
    
   } catch (error) {
    console.log(error);
    return res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json(error.message || "internal server error");
   }
};

export const ownerLogout = (req, res)=>{
  try {
    const token = req.cookies.token;

  res.clearCookie('access_token',token,{ httpOnly: true});
  res.status(StatusCodes.ACCEPTED).json({ message: 'Logged out successfully' });

    
  } catch (error) {
    console.error('Error logging out:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
    
  } 
};

export const forgotPassword =async (req, res)=>{
  try {
  
   
   const {email} = req.body;
   if (!email) {
     return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Email is required' });
   }
   const owner =await Owner.findOne({email});
   if(!owner){
     return res.status(StatusCodes.NOT_FOUND).json({message:'owner not found'});
   };
 
   const token = adminGenerateToken(owner);
   var transporter = nodemailer.createTransport({
       service: serverConfig.service,
       auth: {
         user: serverConfig.email,
         pass: serverConfig.password
       }
     });
     
     var mailOptions = {
       from: serverConfig.email,
       to: owner.email,
       subject: 'Reset Password Link',
       text: `${ownerApi}/reset-password/${owner._id}/${token}`
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
    const decoded = jwt.verify(token, serverConfig.adminToken);
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    const owner = await Owner.findByIdAndUpdate(id, { password: hashedPassword });
    
    if (owner) {
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



export const checkOwner = async (req, res) => {
  console.log("hitting");
  
  const owner = req.owner;
  console.log(owner);
  
try {
  const ownerData = await Owner.findOne({ _id: owner.data });
  if (!ownerData) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: "owner not found", success: false });
  }

  if (ownerData.role !== "owner") {
    return res.status(StatusCodes.FORBIDDEN).json({message: "authentication failed", success: false  });
  }

  res.status(StatusCodes.CREATED).json({ message: "authenticateOwner", success: true });
} catch (error) {
  console.error("Error while checking owner status:", error);
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error", success: false });
}
};


export const checkAdmin = async (req, res) => {   
  const owner = req.owner;

  
try {
  const adminData = await Owner.findOne({ _id: owner.data });
  console.log(adminData);
  if (!adminData) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: "owner not found", success: false });
  }

  if (adminData.role !== "admin") {
    return res.status(StatusCodes.FORBIDDEN).json({message: "authentication failed", success: false  });
  }
  res.status(200).json({ message: "authenticateAdmin", success: true });
} catch (error) {
  console.error("Error while checking owner status:", error);
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error", success: false });
}
};



