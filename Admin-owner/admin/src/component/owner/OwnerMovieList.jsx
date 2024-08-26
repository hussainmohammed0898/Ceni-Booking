import { format } from 'date-fns';
import AddShowModel from './AddShowModel';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../../URL/baseUrl.js';

export default function OwnerMovieList() {
  const [movies, setMovies] = useState([]);
  const [searchMovie, setSearchMovie] = useState('');
  const [showModel, setShowModel] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null); 

 useEffect(()=>{
    const fetchMovies = async ()=>{
        try {
            const res = await axios.get(`${baseUrl}/api/owner/all-movies`, { withCredentials: true });
            console.log('Full Response:', res);
            console.log('Data Type:', typeof res.data);
            setMovies(res.data);   
        } catch (error) {
          console.error('Error fetching movies:', error.message);
        }
    };
    fetchMovies();

 }, []);
  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchMovie.toLowerCase())
  );
  const handleShowModal = (movieId) => {
    setSelectedMovieId(movieId);
    setShowModel(true); 
  };

  return (
    <div className="container mx-1 ">
      <div className="card w-full p-4 shadow-xl mt-1  animate-fade-in-down">
      <div className="card-title flex items-center justify-between">
        <h2 className="text-xl font-semibold">Movies</h2>
        <input className='input input-bordered input-sm  '
        placeholder='Search Movie'
          value={searchMovie}
          onChange={e => setSearchMovie(e.target.value)}
        />
      </div>
        <div className="divider mt-2"></div>
        <div className="h-full min-h-screen overflow-x-auto bg-base-200 rounded-xl">
          <table className="table">
            <thead className='text-lg'>
              <tr>
                <th>Title</th>
                <th>Genre</th>
                <th>Release Date</th>
                <th>Language</th>
                <th>Duration (Min)</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredMovies.map((movie) => (
                <tr key={movie._id} className='border-t border-base-100'>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img src={movie.image} alt={movie.title} className="object-cover" />
                        </div>
                      </div>
                      <div>
                        <p className="font-bold">{movie.title}</p>
                      </div>
                    </div>
                  </td>
                  <td>{movie.genre}</td>
                  <td>{format(new Date(movie.releaseDate), 'dd MMMM yyyy')}</td>
                  <td>{movie.language}</td>
                  <td>{movie.duration} mins</td>
                  <td>
                  <button
                      className="btn btn-success btn-sm text-primary-content"
                      onClick={() => handleShowModal(movie._id)} 
                    >
                      Add Show
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <>
      <AddShowModel
        isOpen={showModel}
        onClose={() => setShowModel(false)}
        refreshShows={() => {
        }}
        selectedMovieId={selectedMovieId}
      />
      </>  
    </div>
  );
}