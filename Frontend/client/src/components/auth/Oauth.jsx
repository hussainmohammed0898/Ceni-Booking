import React from 'react'
import { FcGoogle } from "react-icons/fc";
import {getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { app } from '../../firebase.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { baseUrl } from '../../URL/baseUrl.js';

function Oauth() {
  const navigate = useNavigate();
    const handleGoogleClick = async () =>{
      try {
        const provider = new GoogleAuthProvider()
        const auth = getAuth(app)
        const result = await signInWithPopup(auth, provider);
        console.log("result:",result);
        
        const res = await axios.post(`${baseUrl}/api/user/google`,{
          name: result.user.displayName,
          email: result.user.email,        }, { withCredentials: true });
          console.log('Backend Response:', res);
          if(res.data.success===true){
            toast.success("login successfully");
            navigate("/userHome")
          }
           
           
      } catch (error) {
        console.error('Error during Google authentication', error);
            toast.error('Error during Google authentication');
      }
    }
  return (
    <button onClick={handleGoogleClick} type='button' className='flex items-center justify-center w-full bg-red-700 text-white px-7 py-3 uppercase text-sm font-medium hover:bg-red-800 active:bg-red-900 shadow-md hover:shadow-lg active:shadow-lg transition duration-150 ease-in-out rounded'>
    <FcGoogle className='text-2xl bg-white rounded-full mr-2' />
    Continue with google
    </button>
  )
}

export default Oauth