import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import useMovieTitleStore from '../zustand/store.js';
import { baseUrl } from '../URL/baseUrl.js';

export default function Show() {
  const [shows, setShows] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { id } = useParams();
  const navigate = useNavigate();
  const { movieTitle } = useMovieTitleStore();

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const formattedDate = selectedDate.toISOString().split('T')[0];
        const response = await axios.get(`${baseUrl}/api/user/show?date=${formattedDate}&movieId=${id}`, { withCredentials: true });
        console.log(response.data);

        setShows(response.data);
      } catch (error) {
        console.error('Error fetching shows:', error);
      }
    };

    fetchShows();
  }, [selectedDate, id]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const renderDateTabs = () => {
    const dateTabs = [];
    for (let i = 0; i < 5; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dateTabs.push(
        <button
          key={i}
          className={`px-4 py-2 rounded-md mr-2 border-none ${selectedDate.toDateString() === date.toDateString() ? 'bg-blue-500 text-black font-semibold hover:bg-blue-600 transition ease-out duration-150' : 'bg-slate-800 font-semibold'}`}
          onClick={() => handleDateChange(date)}
        >
          {date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
        </button>
      );
    }
    return dateTabs;
  };

  const ShowSeat = (showId) => {
    navigate(`/showSeat/${showId}`);
  };

  const formatShowTime = (timeString) => {
    let [hour, minute] = timeString.split(':');
    hour = parseInt(hour, 10);
  
    const period = hour >= 12 ? 'PM' : 'AM';
    
    
    if (hour > 12) {
      hour -= 12;
    } else if (hour === 0) {
      hour = 12;
    }
  
    minute = minute.padStart(2, '0');
  
    return `${hour}:${minute} ${period}`;
  };
  
  return (
    <div className="container h-screen mx-auto px-5 md:px-10 py-20 animate-fade-in">
      <h1 className="text-3xl font-semibold mb-4">{movieTitle}</h1>
      <div className="flex mb-4 show">
        {renderDateTabs()}
      </div>
      <div className="divider"></div>
      <ul>
        {shows
          .filter((show) => show.showTimes.length > 0)
          .map((show) => (
            <li key={`${show.theater}-${show.movieTitle}`} className="py-4">
              <h2 className="text-xl font-semibold mb-1">{show.theater}</h2>
              <span className="text-sm pt-5">{show.theaterLocation}</span>
              <div className="flex flex-wrap">
                {show.showTimes.map(({ showTime, showId }) => (
                  <button
                    onClick={() => ShowSeat(showId)}
                    key={showId}
                    className="bg-base-200 hover:bg-base-300 text-white border-white rounded-lg w-20 h-10 mb-3 mr-1"
                  >
                    {formatShowTime(showTime)}
                  </button>
                ))}
              </div>
              <div className="divider"></div>
            </li>
          ))}
      </ul>
    </div>
  );
}
