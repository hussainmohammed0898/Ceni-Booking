import React, { useEffect, useState } from 'react'
import { MovieSkeleton } from '../ui/Skeleton';
import { Link } from 'react-router-dom';
import axios from 'axios';


function Movies() {
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nowPlayingDisplayCount, setNowPlayingDisplayCount] = useState(4);
  const [upcomingDisplayCount, setUpcomingDisplayCount] = useState(4);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/user/movies', { withCredentials: true });
        const currentDate = new Date();

        const nowPlaying = response.data.filter(movie => new Date(movie.releaseDate) <= currentDate);
        const upcoming = response.data.filter(movie => new Date(movie.releaseDate) > currentDate);

        setNowPlayingMovies(nowPlaying);
        setUpcomingMovies(upcoming);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderSkeletons = (count) => {
    return Array.from({ length: count }).map((_, index) => (
      <MovieSkeleton key={index} />
    ));
  };

    const handleNowPlayingLoadMore = () => {
      setNowPlayingDisplayCount(prevCount => prevCount + 4);
    };
  
    const handleUpcomingLoadMore = () => {
      setUpcomingDisplayCount(prevCount => prevCount + 4);
    };
  
    const isMobile = window.innerWidth <= 640;
  
  return (
    <div className='container min-h-screen h-full pt-20  mx-auto'>
       <div className="carousel carousel-center bg-neutral rounded-box  space-x-5 p-4 mb-6">
  {loading ? renderSkeletons(nowPlayingDisplayCount) : nowPlayingMovies.slice(0, isMobile ? nowPlayingMovies.length : nowPlayingDisplayCount).map((movie, index) => (
     <Link key={index} to={`/movie/${movie._id}`}>
     <figure>
    
     <div className="carousel-item  card w-64">
       <img src={movie.image} alt={movie.title} className="rounded-box" />
     </div>
     </figure>
     </Link>
))}
 </div>

    <h1 className="text-3xl lg:text-4xl font-bold mb-6 text-center">Now Showing</h1>
    <div className="flex justify-center">
      <div className="flex gap-4 overflow-x-auto flex-nowrap p-4 animate-fade-in sm:grid sm:grid-cols-2 lg:grid-cols-4">
        {loading ? renderSkeletons(nowPlayingDisplayCount) : nowPlayingMovies.slice(0, isMobile ? nowPlayingMovies.length : nowPlayingDisplayCount).map((movie, index) => (
          <Link key={index} to={`/movie/${movie._id}`} className="card w-52 bg-base-200 flex-shrink-0">
            <figure>
              <img src={movie.image} alt={movie.title} className="w-full h-72 object-fill" />
            </figure>
            <div className="card-body p-4 flex flex-col justify-between">
              <h2 className="card-title mb-2 ">{movie.title}</h2>
              <div className="flex justify-between">
                <p className="text-left">{movie.language}</p>
                <p className="text-right">{movie.genre}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
    {!loading && nowPlayingMovies.length > nowPlayingDisplayCount && !isMobile && (
      <div className="flex justify-center mt-4">
        <button onClick={handleNowPlayingLoadMore} className="btn btn-outline btn-primary">Load More</button>
      </div>
    )}

    {loading && (
      <div className="flex justify-center mt-10">
        <div className="flex gap-4 overflow-x-auto flex-nowrap p-4 animate-fade-in sm:grid sm:grid-cols-2 lg:grid-cols-4">
          {renderSkeletons(nowPlayingDisplayCount)}
        </div>
      </div>
    )}

    {upcomingMovies.length > 0 && (
      <>
        <h1 className="text-3xl lg:text-4xl font-bold mb-6 text-center mt-10">Upcoming Release</h1>
        <div className="flex justify-center">
          <div className="flex gap-4 overflow-x-auto flex-nowrap p-4 animate-fade-in sm:grid sm:grid-cols-2 lg:grid-cols-4">
            {loading ? renderSkeletons(upcomingDisplayCount) : upcomingMovies.slice(0, isMobile ? upcomingMovies.length : upcomingDisplayCount).map((movie, index) => (
              <Link key={index} to={`/movie/${movie._id}`} className="card w-72 bg-base-200 flex-shrink-0">
                <figure>
                  <img src={movie.image} alt={movie.title} className="w-full h-72 object-fill" />
                </figure>
                <div className="card-body p-4 flex flex-col justify-between">
                  <h2 className="card-title mb-2">{movie.title}</h2>
                  <div className="flex justify-between">
                    <p className="text-left">{movie.language}</p>
                    <p className="text-right">{movie.genre}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        {!loading && upcomingMovies.length > upcomingDisplayCount && !isMobile && (
          <div className="flex justify-center mt-4 pb-4">
            <button onClick={handleUpcomingLoadMore} className="btn btn-outline btn-primary">Load More</button>
          </div>
        )}
      </>
    )}
  </div>
   
  )
}

export default Movies