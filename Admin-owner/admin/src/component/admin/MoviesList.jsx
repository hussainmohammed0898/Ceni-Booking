import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import Modal from '../admin/ConfirmModel';
import { BsFillTrash3Fill } from "react-icons/bs";
import AddEditModel from './AddMovies';

export default function MoviesList() {
  const [movies, setMovies] = useState([]);
  const [deleteMovieId, setDeleteMovieId] = useState(null);
  const [movieModel, setMovieModel] = useState(false);
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/admin/all-movies', { withCredentials: true });
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
        await axios.delete(`http://localhost:3000/api/admin/delete-movie/${deleteMovieId}`, { withCredentials: true });
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

  return (
    <div className="container mx-5">
      <div className="card w-full p-6 bg-base-200 shadow-xl mt-6 animate-fade-in-down">
        <div className="card-title flex items-center justify-between">
          <h2 className="text-xl font-semibold">Movies</h2>
          <button className="btn btn-success text-primary-content w-32" onClick={() => handleOpenModal()}>Add</button>
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
              {movies.map((movie) => (
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
                    <button className="text-2xl text-error hover:animate-swing ease-in-out" onClick={() => handleDelete(movie._id)}>
                      <BsFillTrash3Fill className="w-8" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
      
    </div>
  );
}