import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../URL/baseUrl.js';

function UserRoute({children}) {
    const navigate = useNavigate();
    const [authChecked, setAuthChecked] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await axios.get(
          `${baseUrl}/api/user/check-user`, { withCredentials: true}
        );
        const data = res.data;
        if (data.success === true) {
          setIsAuthenticated(true);
        }
        else{
          navigate("/login", { replace: true });
        }
      } catch (error) {
        console.error("Error occurred while checking user:", error);
        navigate("/login", { replace: true });
      } finally {
        setAuthChecked(true);
      }
      
    };
    checkUser();
  }, [navigate]);

  if (!authChecked) {
    return null;
  }
  return isAuthenticated ? children : null;
};

export default UserRoute