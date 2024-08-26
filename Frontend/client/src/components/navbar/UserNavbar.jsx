import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { BiSolidCameraMovie } from "react-icons/bi";
import axios from 'axios';
import toast from 'react-hot-toast';
import ToggleTheme from '../../ui/ToggleTheme';
import { baseUrl } from '../../URL/baseUrl.js';

function UserNavbar() {
    const navigate = useNavigate()
  const links = [
    { name: 'HOME', path: '/home' },
    { name: 'MOVIES', path: '/userHome' },
    { name: 'MY BOOKINGS HISTORY', path: '/bookings'}
  ];
  const handleLogout = async () => {
    try {
     await axios.post(`${baseUrl}/api/user/logout`," ",{  withCredentials: true });
      toast.success('Logged out successfully');

      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }


  return (
    <div className="navbar bg-slate-800 z-50 shadow-lg fixed">
  <div className="navbar-start">
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
       {links.map(link => (
              <li className='text-3xl' key={link.name}>
                <Link to={link.path}>{link.name}</Link>
              </li>
            ))}
      </ul>
    </div>
    <Link to={'/'}  className="btn btn-ghost text-xl" >
    <BiSolidCameraMovie className='text-yellow-600' />
    CineBooking</Link>
  </div>
  <div className="navbar-center hidden lg:flex">
    <ul className="menu menu-horizontal px-1">
    {links.map(link => (
            <li key={link.name} className='text-lg hover:text-yellow-500'>
              <Link to={link.path}>{link.name}</Link>
            </li>
          ))}
          </ul>
  </div>
  
  <div className="navbar-end gap-4">
  <ToggleTheme/>
  <button onClick={handleLogout} className="btn bg-yellow-500 text-gray-800 font-bold border-none hover:bg-yellow-600 ">LOGOUT</button>
  </div>
</div>
  )
}

export default UserNavbar