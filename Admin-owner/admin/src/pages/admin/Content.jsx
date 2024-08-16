import React from 'react'
import { Outlet } from 'react-router-dom'

function Content() {
  return (
    <div className=' min-h-screen w-full p-5  bg-base-100'>
        <Outlet />
    </div>
   
  )
}

export default Content