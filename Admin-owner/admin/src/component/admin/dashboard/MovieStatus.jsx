import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CountUp from 'react-countup';

export default function MovieStatus() {
  const [totalMovies, setTotalMovies] = useState(0);

  useEffect(() => {
    const fetchTotalMovies = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/admin/total-movies', { withCredentials: true });
        setTotalMovies(res.data.totalMovies);
        
      }catch (error) {
        console.log('Error fetching total movies:', error.message);
      }
    };

    fetchTotalMovies();
  }, []);

  return (
    <div className="stats bg-base-200 text-center shadow-lg animate-slide-in-bottom">
      <div className="stat">
        <div className="stat-title  text-neutral-content">TOTAL MOVIES</div>
        <div className="stat-value">
          <CountUp end={totalMovies} duration={1} />
        </div>
        <div className="stat-actions">
          <Link to='/movies' className="btn  btn-sm btn-info text-primary-content">View</Link>
        </div>
      </div>
    </div>
  );
}