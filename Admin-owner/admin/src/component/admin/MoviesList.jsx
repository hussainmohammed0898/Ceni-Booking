import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import Modal from '../admin/ConfirmModel';
import { BsFillTrash3Fill } from "react-icons/bs";
import AddEditModel from './AddMovies';
import { baseUrl } from '../../URL/baseUrl.js';
import {  useNavigate } from 'react-router-dom';
import MovieDetails from './MovieDetails.jsx';


export default function MoviesList() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [deleteMovieId, setDeleteMovieId] = useState(null);
  const [movieModel, setMovieModel] = useState(false);
  const [detailsModel, setDetailsModel] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/admin/all-movies`, { withCredentials: true });
        console.log("response:",res.data);
        
        setMovies(res.data);
      } catch (error) {
        console.log('Error fetching movies:', error.message);
      }
    };

    fetchMovies();
  }, []);

  const handleDelete = (movieId) => {
    setDeleteMovieId(movieId);
 
  };

  const confirmDelete = async () => {
    if (deleteMovieId) {
      try {
        await axios.delete(`${baseUrl}/api/admin/delete-movie/${deleteMovieId}`, { withCredentials: true });
        setMovies(movies.filter(movie => movie._id !== deleteMovieId));
        toast.success('Movie deleted successfully');
      } catch (error) {
        console.error('Error deleting movie:', error.message);
        toast.error('Failed to delete movie');
      } finally {
        setDeleteMovieId(null);
      }
    }
  };

  const cancelDelete = () => {
    setDeleteMovieId(null);
  };

  const handleOpenModal = () => {
    setMovieModel(true);
  };

  const handleCloseModal = () => {
    setMovieModel(false);
  };

  const addMovie = (newMovie) => {
    setMovies((prevMovies) => [...prevMovies, newMovie]);
  };
  const handleViewDetails = (movieId) => {
    setSelectedMovieId(movieId);
    setDetailsModel(true);
  };

  const handleCloseDetails = () => {
    setDetailsModel(false);
    setSelectedMovieId(null);
  };
  


  return (
    <div className="overflow-x-auto h-screen">
    <div className="card-title flex items-center justify-between mt-4 mb-4 mx-2">
            <h2 className="text-xl font-semibold">Movies</h2>
            <button className="btn btn-success text-primary-content w-32" onClick={() => handleOpenModal()}>Add</button>
        </div>  
<table className="table">
<thead>
  <tr>
    <th>Title</th>
    <th>Genre</th>
    <th>Release Date</th>
    <th>Language</th>
    <th>Duration</th>
  </tr>
</thead>
<tbody>

{movies.map((movie) => (
                <tr key={movie._id} className='border-t border-base-200'>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img src={movie.image} alt={movie.title} className="object-cover cursor-pointer" onClick={() => handleViewDetails(movie._id)} />
                        </div>
                      </div>
                      <div>
                        <p className="font-bold">{movie.title}</p>
                      </div>
                    </div>
                  </td>
                  <td >
                    {movie.genre}
                  </td>
                  <td>{format(new Date(movie.releaseDate), 'dd MMMM yyyy')}</td>
                  <td>{movie.language}</td>
                  <td>{movie.duration} mins</td>
                  <td>
                    <button className="text-2xl text-error hover:animate-swing ease-in-out" onClick={() => handleDelete(movie._id)}>
                      <BsFillTrash3Fill className="w-8" />
                    </button>
                  </td>
                </tr>
              ))}
</tbody>
</table>
      <Modal
        isOpen={deleteMovieId !== null}
        onProceed={confirmDelete}
        onCancel={cancelDelete}
        title="Confirm Delete"
        description="Are you sure you want to delete this movie?"
      />
      <AddEditModel
        isOpen={movieModel}
        onClose={handleCloseModal}
        addMovie={addMovie}
      />
      <MovieDetails
        isOpen={detailsModel}
        onClose={handleCloseDetails}
        movieId={selectedMovieId}
      />
      
    </div>
  );
}