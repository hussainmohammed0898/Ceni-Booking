import jwt from 'jsonwebtoken';
import serverConfig from '../config/serverConfig.js';
import { StatusCodes } from 'http-status-codes';


function authenticateUser(req, res, next) {
  
    const token = req.cookies.access_token;
    jwt.verify(token, serverConfig.token, (err, user) => {
      console.log(err,'Error');
      if (err) return res.sendStatus(StatusCodes.FORBIDDEN);
      req.user = user;
      next();
    });
  }
  
  export default authenticateUser;;