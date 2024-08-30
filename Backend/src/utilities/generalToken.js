import jwt from 'jsonwebtoken';
import serverConfig from '../config/serverConfig.js';


export const generateToken = (user)=>{
  if (!user || !user._id) {
    throw new Error('User object is required to generate a token');
  }
  const token =  jwt.sign({data:user._id, email: user.email},serverConfig.token,{expiresIn: "1d"});
  return token;

};

export const adminGenerateToken = (owner)=>{
  const token = jwt.sign({ data:owner._id, role:owner.role},serverConfig.adminToken,{expiresIn: "1d"});
  console.log("token:",token);
  
  return token;
};

