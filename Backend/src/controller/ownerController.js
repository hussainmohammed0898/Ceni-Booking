import Owner from "../models/ownerModel.js";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import { adminGenerateToken } from "../utilities/generalToken.js";



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
        return res.status(StatusCodes.NOT_ACCEPTABLE).json({message:"user already exist"});
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
    
    console.log(comparePassword);

    if(!comparePassword){
        return res.status(StatusCodes.NOT_ACCEPTABLE).json({message:"password incorrect"});
    };

    const token = adminGenerateToken(ownerExist);
    console.log(token);
   
    res.cookie('access_token',token,{httpOnly:true})
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

export const checkOwner = async (req, res) => {
  const owner = req.owner;
try {
  const ownerData = await Owner.findOne({ _id: owner.ownerId });
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
  const adminData = await Owner.findOne({ _id: owner.ownerId });
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



