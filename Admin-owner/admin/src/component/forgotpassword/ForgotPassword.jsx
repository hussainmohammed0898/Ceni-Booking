import React, { useState } from 'react'
import axios from 'axios';
import toast from 'react-hot-toast';
import { baseUrl } from '../../URL/baseUrl.js';

function ForgotPassword() {
    const [email, setEmail] = useState();


    const handleSubmit = async (e)=>{
        e.preventDefault();
        
        if (!email) {
          toast.error('Email address is required');
          return;
        }
        try {
          const response = await axios.post(`${baseUrl}/api/owner/forgot-password`, { email });
          console.log("backend",response);
          toast.success(response.data.message);
      } catch (error) {
          console.error('Error sending password reset email', error);
          toast.error('Error sending password reset email');
      }
    };




  return (
    <section className='lg:h-screen'> 
    <h1 className='text-3xl text-center mt-6 font-bold uppercase'>Forgot Password</h1>
    <div className='flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto'>
      <div className='md:w-[67%] lg:w-[50%] mb-12 md:mb-6'>
        <img src="https://plus.unsplash.com/premium_photo-1709842822358-006f08261139?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="key" className='w-full rounded-2xl' />
      </div>
      <div className='w-full md:w-67% lg:w-[40%] lg:ml-20'>
        <form onSubmit={handleSubmit}>
          <input 
          className='mb-6 w-full px-4 py-2 text-xl text-gray-300  bg-slate-900 input input-bordered input-primary w-100  rounded' 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Email address'/>
          <button className='w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800' 
        type='submit'>Forgot Password</button>
        </form>
      </div>
    </div>
   </section>
   


   
    
  )
}

export default ForgotPassword