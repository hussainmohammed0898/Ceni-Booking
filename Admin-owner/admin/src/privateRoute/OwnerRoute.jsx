import axios from 'axios';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from '../URL/baseUrl.js';


const OwnerRoutes = ({ children }) => {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkOwner = async () => {
      try {
        const res = await axios.get(
          `${baseUrl}/api/owner/check-owner`, { withCredentials: true }
        );
        const data = res.data;
        if (data.success === true) { 
            setIsAuthenticated(true);
          } else {
            navigate("/login", { replace: true });
          }
        } catch (error) {
          console.error("Error occurred while checking :", error);
          navigate("/login", { replace: true });
        } finally {
          setAuthChecked(true);
        }
      };
    checkOwner();
  }, [navigate]);

  if (!authChecked) {
    return null;
  }

  return isAuthenticated ? children : null;
};

export default OwnerRoutes;