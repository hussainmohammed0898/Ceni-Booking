import jwt from "jsonwebtoken";
import serverConfig from "../config/serverConfig.js";
import { StatusCodes } from "http-status-codes";


function authenticateAdmin(req, res, next) {
  const token = req.cookies.access_token;
  
  

  if(!token){
    res.status(StatusCodes.UNAUTHORIZED).json({message:"Access token is missing"});
  }
 
  jwt.verify(token, serverConfig.adminToken, (err, owner) => {
    if (err) {
      console.log("Token verification failed:", err);
      return res.status(StatusCodes.FORBIDDEN).json({ message: "Invalid or expired token" });
    }

    req.owner = owner;  
    if (req.owner.role !== "admin") {
      return res.send("not authenticated");
    }
    next();
  });
}

export default authenticateAdmin;;