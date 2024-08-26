import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../URL/baseUrl.js';

function AuthRoute({children}) {
    const navigate = useNavigate();
    useEffect(() => {
        const checkUser = async () => {
          try {
            const res = await axios.get(`${baseUrl}/api/user/check-user`, { withCredentials: true });
            const data = res.data;
            
            if (data.success===true) {
              navigate('/home', { replace: true });
            }
          } catch (error) {
            console.error('Error occurred while checking user:', error);
          }
        };
        checkUser();
      }, [navigate]);
  return children
}

export default AuthRoute