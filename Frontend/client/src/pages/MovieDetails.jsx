import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import useMovieTitleStore from '../zustand/store';
import { MovieDetailSkeleton } from '../ui/Skeleton';
import ShowReview from '../pages/ShowReview';
import { baseUrl } from '../URL/baseUrl.js';

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const { movieTitle, setMovieTitle } = useMovieTitleStore(); 

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/user/movie-details/${id}`, { withCredentials: true });
        console.log("res:", response.data);
        
        setMovie(response.data);
        setMovieTitle(response.data.title);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id, setMovieTitle]);

  if (isLoading) {
    return (
      <div className='container min-h-screen h-full lg:h-full mx-auto pt-20 animate-fade-in'>
        <MovieDetailSkeleton />
      </div>
    );
  }

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / reviews.length;
  };

  const avgRating = movie && movie.reviews ? calculateAverageRating(movie.reviews) : 0;
  const yellowStars = Math.floor(avgRating);

  return (
    <div className='container min-h-screen h-full lg:h-full mx-auto pt-20'>
      <div className="grid grid-cols-12 gap-6 p-6 rounded-lg bg-base-100 animate-fade-in">
        <div className="col-span-12 lg:col-span-6 lg:text-left">
          <img src={movie?.image} alt={movie?.title} className="max-w-full lg:max-w-sm mx-auto rounded-lg" />
        </div>
        <div className="col-span-12 lg:col-span-6 flex flex-col justify-between lg:justify-start lg:text-left">
          <div className="pt-6">
            <h1 className="text-3xl lg:text-4xl font-bold mb-4 break-words">{movie?.title}</h1>
            <p className="text-lg mb-2 ml-2"><strong>Genre:</strong> {movie?.genre}</p>
            <p className="text-lg mb-2 ml-2"><strong>Language:</strong> {movie?.language}</p>
            <p className="text-lg mb-2 ml-2"><strong>Duration:</strong> {movie?.duration} Minutes</p>
            <p className="text-lg mb-2 ml-2"><strong>Actor:</strong> {movie?.actorName}</p>
            <p className="text-lg mb-2 ml-2"><strong>Director:</strong> {movie?.director}</p>
            <p className="text-lg mb-2 ml-2"><strong>Release Date:</strong> {movie ? new Date(movie.releaseDate).toDateString() : ''}</p>
            <div className="flex items-center mb-2 ml-2">
              <div className="rating gap-1 pointer-events-none">
                {[1, 2, 3, 4, 5].map((star, index) => (
                  <input
                    key={index}
                    type="radio"
                    name="avgRating"
                    disabled
                    className={`mask mask-star-2 ${index < yellowStars ? 'bg-warning' : ''} ${index < yellowStars ? 'checked' : ''}`}
                  />
                ))}
                <span className='text-lg'>({movie?.reviews?.length || 0})</span>
              </div>
            </div>
            <div className="text-right lg:text-left pt-5">
              <Link to={`/shows/${movie?._id}`}>
                <button className="btn btn-warning mt-4 lg:mt-0 self-end">BOOK TICKETS NOW</button>
              </Link>
              <p className='pt-5 text-lg mb-2 text-left'>{movie?.description}</p>
            </div>
          </div>
        </div>
      </div>
      <ShowReview reviews={movie?.reviews || []} />
    </div>
  );
}
