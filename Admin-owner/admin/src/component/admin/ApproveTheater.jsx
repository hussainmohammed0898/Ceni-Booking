import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { baseUrl } from '../../URL/baseUrl.js';

function ApproveTheater() {
    const [theaters, setTheaters] = useState([]);
    const [searchTheater, setSearchTheater] = useState('');

    useEffect(() => {
        const fetchTheater = async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/admin/approved-theaters`,{withCredentials:true});
                setTheaters(response.data);
            } catch (error) {
                console.error('Error fetching theaters:', error);
            }
        };

        fetchTheater();
    }, []);

    const filteredTheaters = theaters.filter(theater =>
        theater.name.toLowerCase().includes(searchTheater.toLowerCase())
    );
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
                
                 </td>
                  </tr>
            ))}
</tbody>
</table>
</div>
   
  )
}

export default ApproveTheater