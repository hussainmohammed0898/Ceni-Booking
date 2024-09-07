import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { baseUrl } from '../../URL/baseUrl.js';
import axios from 'axios';

function MovieDetails({ isOpen, onClose, movieId }) {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);

    useEffect(() => {
        const fetchMovie = async () => {
          try {
            console.log(`Fetching details for movieId: ${movieId}`);
            const res = await axios.get(`${baseUrl}/api/admin/movie-details/${movieId}`, { withCredentials: true });
            setMovie(res.data);
          } catch (error) {
            console.log('Error fetching movie details:', error.message);
          }
        };
        fetchMovie();

      
      }, [movieId]);
      if (!isOpen || !movie) return null;

  return (
    <div className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box">
        <h2 className="text-2xl font-bold">{movie.title}</h2>
        <img src={movie.image} alt={movie.title} className="h-56 mt-4" />
        <p className="mt-4"><strong>Genre:</strong> {movie.genre}</p>
        <p><strong>Release Date:</strong> {new Date(movie.releaseDate).toLocaleDateString()}</p>
        <p><strong>Language:</strong> {movie.language}</p>
        <p><strong>Duration:</strong> {movie.duration} mins</p>
        <p><strong>Description:</strong> {movie.description}</p>
        <div className="modal-action">
          <button className="btn bg-red-500 text-gray-800 hover:bg-red-600" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}

export default MovieDetails