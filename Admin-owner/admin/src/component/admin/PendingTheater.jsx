import React, { useEffect, useState } from 'react'
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import axios from 'axios';
import { baseUrl } from '../../URL/baseUrl.js';



function PendingTheater() {
    const [theaters, setTheaters] = useState([]);
    const [searchTheater, setSearchTheater] = useState('');

    useEffect(() => {
        const fetchPendingTheaters = async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/admin/not-approved-theaters`, {withCredentials:true});
                console.log(response.data);
                setTheaters(response.data);
                
                
            } catch (error) {
                console.error("Error fetching pending theaters", error.message);
            }
        };

        fetchPendingTheaters();
    }, []);

    const filteredTheaters = theaters.filter(theater =>
        theater.name.toLowerCase().includes(searchTheater.toLowerCase())
    );

    const approveTheater = async (theaterId) => {
      const token = localStorage.getItem('token');
        try {
          const response = await axios.put(`${baseUrl}/api/admin/approve-theaters/${theaterId}`,null,{
              headers: {
                  Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
          });
          console.log(response.data);
            setTheaters(theaters.filter(theater => theater._id !== theaterId));
          
            
            toast.success('Theater approved successfully');
        } catch (error) {
            console.error("Error approving theater", error.message);
            console.error('Error approving theater:', error);
        }
    };


  return (
    <div className="overflow-x-auto h-screen">
        <div className="card-title flex items-center justify-between mt-4 mb-4 mx-2">
                <h2 className="text-xl font-semibold">Approve Theaters</h2>
                <input
                    className='input input-bordered input-sm'
                    placeholder='Search Theater'
                    value={searchTheater}
                    onChange={e => setSearchTheater(e.target.value)}
                />
            </div>
  {filteredTheaters.length > 0 ? (    
  <table className="table">
    <thead>
      <tr>
        <th>Theater Name</th>
        <th>Owner Name</th>
        <th>Location</th>
        <th>Registered On</th>
      </tr>
    </thead>
    <tbody>
    {filteredTheaters.map((theater) => (
         <tr key={theater._id} className='border-t border-base-100'>
           <td>
             <div className='w-auto h-12 flex items-center'>
                 <p className="font-bold">{theater.name.toUpperCase()}</p>
                    </div>
                 </td>
                  <td>{theater.owner.name}</td>
                  <td>{theater.location}</td>
                  <td>{format(new Date(theater.createdAt), 'dd MMMM yyyy')}</td>
                  <td>
                    <button className="btn btn-success text-primary-content" onClick={() =>approveTheater(theater._id)}>
                       Approve
                   </button>
                     </td>
                      </tr>
                ))}
    </tbody>
  </table>
) : (
                    <div className="text-center text-xl mt-6">
                        No theaters for approval.
                    </div>
                )}
</div>

  )
}

export default PendingTheater