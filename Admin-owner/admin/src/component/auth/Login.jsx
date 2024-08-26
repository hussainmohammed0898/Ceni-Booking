import React, { useState } from 'react'
import { useForm } from "react-hook-form";
import { FaEyeSlash,FaEye  } from "react-icons/fa";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useUserRoleStore from '../../store/useUserRoleStore';
import { baseUrl } from '../../URL/baseUrl.js';


const userSchema = yup.object({
    email: yup.string().required('Please enter your email').email('Please enter a valid email'),
    password: yup.string().required('Please enter your password')
});



function Login() {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const setUserRole = useUserRoleStore((state) => state.setUserRole);


    const { register, handleSubmit, formState: { errors }, } = useForm({
        resolver: yupResolver(userSchema),
    }) 

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const res = await axios.post(`${baseUrl}/api/owner/login`, data, { withCredentials: true, },);
           
            const userRole = res.data.role;
            setUserRole(userRole); 
            if (userRole === 'admin') {
                navigate("/adminDashboard");
            } else if (userRole === 'owner') {
                navigate("/ownerDashboard");
            }else {
                navigate("/login");
            }
            toast.success(res.data.message);
            setLoading(false);
        } catch (error) {
            toast.error('Invalid Credentials');
            console.log(error);
            setLoading(false);
        }
    };
    
  return (
    <section className='lg:h-screen'>
    <h1 className='text-3xl text-center mt-6 font-bold uppercase'>Login</h1>
    <div className='flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto'>
    <div className='md:w-[67%] lg:w-[50%] mb-12 md:mb-6'>
      <img src="https://plus.unsplash.com/premium_photo-1709842822358-006f08261139?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="key" className='w-full rounded-2xl' />
    </div>
    <div className='w-full md:w-67% lg:w-[40%] lg:ml-20'>
      <form onSubmit={handleSubmit(onSubmit)} >
        <input  
        type="email" 
        placeholder='Email'
        {...register("email")} 
        className='mb-2 w-full px-4 py-2 text-xl text-gray-300  bg-slate-900 input input-bordered input-primary w-100  rounded ' 
        />
        {errors.email && (
          <span className="text-error block text-sm  mb-4 ml-2">
             {errors.email.message}
               </span>
         )}
        <div className='relative'>
         <input  
        type={showPassword ? "text" : "password"} 
        placeholder='Password'
        {...register("password")} 
        className='mb-2 w-full px-4 py-2 text-xl  text-gray-300   bg-slate-900 input input-bordered input-primary w-100 rounded ' 
        />
         {showPassword ? (
          <FaEyeSlash className='absolute right-3 top-3 text-xl cursor-pointer' onClick={()=>setShowPassword((prevState)=>!prevState)}/>

        ):(<FaEye className='absolute right-3 top-3 text-xl cursor-pointer' 
        onClick={()=>setShowPassword
        ((prevState)=>!prevState)}/>)}
        </div>
        {errors.password && (
          <span className="text-error block text-sm mb-4 ml-2">
             {errors.password.message}
                </span>
          )}
        
        <div className='flex justify-between whitespace-nowrap text-sm sm:text-lg'>
          <p className='mb-6'>Don't have a account?
          <Link className='text-red-600 hover:text-red-700 transition duration-200 ease-in-out ml-1'  to='/sign-up'>
              Register
              </Link>
          </p>
          <p>
            <Link className='text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out' to={'/forgot-password'}>Forgot password?</Link>
          </p>
        </div>
        <button className='w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800' 
      type='submit' disabled={loading}>{loading ? <span className='loading loading-spinner bg-primary '></span> : "Login"}</button>
      </form>
      </div>
    </div>
  </section>
   
  )
}

export default Login