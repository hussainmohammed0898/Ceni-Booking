import React from 'react'
import Footer from '../component/footer/Footer'
import AdminNavbar from '../component/admin/AdminNavbar'
import LeftSide from '../component/admin/LeftSide'
import { Outlet } from 'react-router-dom'

function AdminLayout() {
  return (
    <>
    <div className='drawer flex lg:drawer-open'>
    <input id="left-sidebar-drawer" type="checkbox" className="drawer-toggle" />
    <LeftSide/>
    <div className='flex flex-col flex-1 w-3/4'>
    <AdminNavbar/>
    <Outlet/>
    <Footer/>
    </div>
    </div>
    </>
  )
}

export default AdminLayout