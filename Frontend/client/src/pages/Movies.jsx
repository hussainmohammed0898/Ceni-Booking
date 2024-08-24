import React, { useEffect, useState } from 'react'
import { MovieSkeleton } from '../ui/Skeleton';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";


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
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 4,
      autoplay: true,
      autoplaySpeed: 3000,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
          }
        },
        {
          breakpoint: 640,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          }
        }
      ]
    };
  
  return (
    <div className='container min-h-screen h-full pt-20 mx-auto'>
       <div className="w-full hidden md:block">
        {loading ? (
          <div className="flex justify-center">
            {renderSkeletons(4)}
          </div>
        ) : (
          <Slider {...settings}>
            {nowPlayingMovies.map((movie, index) => (
              <Link key={index} to={`/movie/${movie._id}`}>
                <div className="px-2">
                  <figure className="w-full">
                    <img src={movie.image} alt={movie.title} className="rounded-lg w-full h-96"/>
                  </figure>
                </div>
              </Link>
            ))}
          </Slider>
        )}
      </div>

    <h1 className="text-3xl lg:text-4xl font-bold mb-6 text-center mt-5">Now Showing</h1>
    <div className="flex justify-center">
      <div className="flex gap-4 overflow-x-auto flex-nowrap p-4 animate-fade-in sm:grid sm:grid-cols-2 lg:grid-cols-4">
        {loading ? renderSkeletons(nowPlayingDisplayCount) : nowPlayingMovies.slice(0, isMobile ? nowPlayingMovies.length : nowPlayingDisplayCount).map((movie, index) => (
          <Link key={index} to={`/movie/${movie._id}`} className="card w-52 bg-base-200 flex-shrink-0">
            <figure>
              <img src={movie.image} alt={movie.title} className="w-full h-72 object-fill" />
            </figure>
            <div className="card-body p-4 flex flex-col justify-between shadow-lg hover:bg-base-300 rounded duration-150 transition ea">
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
              <Link key={index} to={`/movie/${movie._id}`} className="card w-52 bg-base-200 flex-shrink-0">
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