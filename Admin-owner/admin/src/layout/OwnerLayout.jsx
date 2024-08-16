import React from 'react'
import OwnerSidebar from '../component/owner/OwnerSidebar'
import OwnerNavbar from '../component/owner/OwnerNavbar'
import Footer from '../component/footer/Footer'
import { Outlet } from 'react-router-dom'

function OwnerLayout() {
  return (
    <>
    <div className='drawer flex lg:drawer-open'>
    <input id="left-sidebar-drawer" type="checkbox" className="drawer-toggle" />
    <OwnerSidebar/>
    <div className='flex flex-col flex-1 w-3/4'>
    <OwnerNavbar/>
    <Outlet/>
    <Footer/>
    </div>
    </div>
    </>
  )
}

export default OwnerLayout