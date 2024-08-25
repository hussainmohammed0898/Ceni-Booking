import React, { useState } from 'react';
import { BiSolidCameraMovie } from 'react-icons/bi';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { Link, NavLink, useLocation } from 'react-router-dom';
import usePageTitleStore from '../../store/usePageTitleStore';




const links = [
    { name: 'Dashboard', path: '/adminDashboard' },
    { name: 'Movies', path: '/movies' },
    { name: 'Users', path: '/users' },
    {
      name: 'Theaters',
      subLinks: [
        { name: 'Approved Theaters', path: '/theaters/approved' },
        { name: 'Pending Approvals', path: '/theater/pending-approval' }
      ]
    },
  ];

function LeftSide() {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});
  const setPageTitle = usePageTitleStore((state)=> state.setPageTitle);

  const toggleSubMenu = (index) => {
    setOpenMenus((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const handleLinkClick = (name) => {
    setPageTitle(name); 
  };

  return (
    <div className="drawer-side z-30">
    <label htmlFor="left-sidebar-drawer" className="drawer-overlay"></label>
    <ul className="menu pt-2 w-72 bg-base-200 min-h-full text-base-content">
      <li className=" font-semibold text-xl">
        <Link to="/adminDashboard"  className="btn btn-ghost text-xl">
        <BiSolidCameraMovie className='text-yellow-600' />
        CeniBooking
        </Link>
      </li>
      <div className='divider mt-0 top-0'></div>

      {links.map((link, index) => (
        <li key={index}>
          {link.subLinks ? (
            <>
              <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSubMenu(index) &  handleLinkClick(link.name)}>
                <span className="font-normal text-lg">{link.name}</span>
                <span>
                  {openMenus[index] ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              </div>
              {openMenus[index] && (
                <ul className="ml-4">
                  {link.subLinks.map((subLink, subIndex) => (
                    
                    <li key={`${index}-${subIndex}`}>
                      
                      <NavLink
                        end
                        to={subLink.path}
                        className={({ isActive }) => `${isActive ? 'font-semibold bg-base-200 text-md mb-1' : 'font-normal text-md mb-1'}`}
                      >
                        {subLink.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <NavLink
              end
              to={link.path}
              onClick={() => handleLinkClick(link.name)}
              
              className={({ isActive }) => `${isActive ? 'font-semibold bg-base-200 text-lg' : 'font-normal text-lg'}`}
            >
              {link.name}
              {location.pathname === link.path && (
                <span className="absolute inset-y-0 left-0 w-1 rounded-tr-md rounded-br-md" aria-hidden="true"></span>
              )}
            </NavLink>
          )}
        </li>
      ))}
    </ul>
  </div>
  )
}

export default LeftSide