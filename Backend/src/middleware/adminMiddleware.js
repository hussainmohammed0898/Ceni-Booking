import jwt from "jsonwebtoken";
import serverConfig from "../config/serverConfig.js";


function authenticateAdmin(req, res, next) {
  const token = req.cookies.access_token;
  
  jwt.verify(token, serverConfig.adminToken, (err, owner) => {
    console.log(err);

    if (err) return res.sendStatus(403);

    req.owner = owner;
    
    if (req.owner.role !== "admin") {
      return res.send("not authenticated");
    }
    next();
  });
}

export default authenticateAdmin;;