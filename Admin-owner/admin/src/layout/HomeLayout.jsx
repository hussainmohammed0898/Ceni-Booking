import React from 'react'
import Navbar from '../component/navbar/Navbar'
import { Outlet } from 'react-router-dom'
import Footer from '../component/footer/Footer'

function HomeLayout() {
  return (
    <>
    <Navbar/>
    <Outlet/>
    <Footer/>
    </>
  )
}

export default HomeLayout