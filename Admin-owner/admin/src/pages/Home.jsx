import React from 'react'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div
    className="hero min-h-screen"
    style={{
      backgroundImage: "url(https://images.unsplash.com/photo-1640127249305-793865c2efe1?q=80&w=2003&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
    }}>
    <div className="hero-overlay w-full  backdrop-blur-sm bg-opacity-20"></div>
    <div className="hero-content text-neutral-content text-center">
      <div className="max-w-md">
        <h1 className="mb-3 text-lg sm:text-4xl text-white font-bold">BOOK YOUR TICKET FOR MOVIES</h1>
        <p className="mb-3 text-white text-sm sm:text-lg">
        SAFE,  SECURE, RELIABLE TICKETING. YOUR TICKET IS TO LIVE ENTERTAINMENT!
        </p>
        <Link to={'/login'}>
        <button className="btn bg-yellow-500 text-gray-800 font-bold text-lg hover:bg-yellow-600">LOGIN</button></Link>
      </div>
    </div>
  </div>
  )
}

export default Home