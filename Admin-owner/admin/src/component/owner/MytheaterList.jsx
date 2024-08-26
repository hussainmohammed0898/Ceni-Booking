import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { MyTheatersSkeleton } from '../../ui/skeleton';
import { baseUrl } from '../../URL/baseUrl.js';


export default function MytheaterList() {
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseUrl}/api/owner/my-theaters`, { withCredentials: true });
        console.log(response.data);
        setTheaters(response.data);
      } catch (error) {
        console.error('Error fetching theaters:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTheaters();
  }, []);

  if (loading) {
    return <MyTheatersSkeleton />;
  }

  return (
    <div className='min-h-screen mx-5 my-8 '>
      {theaters.length > 0 ? (
        theaters.map((theater) => (
          <div key={theater._id} className="bg-base-200 rounded-lg shadow-md p-6 my-4 grid grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-start">
              <h3 className="text-sm font-medium">Name</h3>
              <p className="mt-1 text-xl font-semibold">{theater.name.toUpperCase()}</p>
            </div>
            <div className="flex flex-col items-center">
              <h3 className="text-sm font-medium">Location</h3>
              <p className="mt-1 text-xl font-semibold">{theater.location}</p>
            </div>
            <div className="flex flex-col items-end">
              <h3 className="text-sm font-medium">Status</h3>
              <p className="mt-1 text-xl font-semibold">
                {theater.approved ? (
                  <span className="badge badge-success text-primary-content">Approved</span>
                ) : (
                  <span className="badge badge-warning text-primary-content">Pending</span>
                )}
              </p>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center lg:text-3xl">No theaters available</div>
      )}
    </div>
  );
}