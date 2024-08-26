import React from 'react'
import { BiSolidCameraMovie } from "react-icons/bi";
import { Link } from 'react-router-dom';



function Navbar() {
  const links = [
    { name: 'HOME', path: '/' },
  ];
  return (
    <div className="navbar bg-slate-800 z-50">
  <div className="navbar-start">
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h8m-8 6h16" />
        </svg>
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
    CeniBooking</Link>
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
  <div className="navbar-end">
  <Link to="/sign-up" className="btn bg-yellow-500 text-gray-800 font-bold border-none hover:bg-yellow-600 ">SIGNUP</Link>
  </div>
</div>
   
  )
}

export default Navbar