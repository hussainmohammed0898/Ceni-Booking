import jwt from "jsonwebtoken";
import serverConfig from "../config/serverConfig.js";
import { StatusCodes } from "http-status-codes";


function authenticateOwner(req, res, next) {
  const token = req.cookies.access_token;
  
  jwt.verify(token, serverConfig.adminToken, (err, owner) => {

    if (err) return res.sendStatus(StatusCodes.FORBIDDEN);

    req.owner = owner;
    if (req.owner.role !== "owner") {
      return res.send("not authenticated");
    }
    next();
  });
}
export default authenticateOwner;;