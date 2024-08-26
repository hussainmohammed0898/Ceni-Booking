import React, { useEffect, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import toast from 'react-hot-toast';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, setHours, setMinutes } from 'date-fns';
import { baseUrl } from '../../URL/baseUrl.js';


const showSchema = Yup.object().shape({
    movieId: Yup.string().required('Movie is required'),
    theaterId: Yup.string().required('Theater is required'),
    price: Yup.number()
        .required('Ticket price is required')
        .typeError('Ticket price must be a number')
        .positive('Ticket price must be a positive number'),
    dateTime: Yup.date()
        .typeError('Date and time must be a valid date')
        .required('Date and time is required')
});

const AddShowModel = ({ isOpen, onClose, refreshShows, selectedMovieId }) => {
    const [movies, setMovies] = useState([]);
    const [theaters, setTheaters] = useState([]);
    const [minDate, setMinDate] = useState(null);
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, control, reset, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(showSchema)
    });

    const selectedMovie = useWatch({ control, name: 'movieId' });

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/owner/select-movie`, { withCredentials: true });
                setMovies(response.data);
            } catch (error) {
                console.error("Error fetching movies", error.message);
                toast.error("Failed to fetch movies");
            }
        };

        const fetchTheaters = async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/owner/select-theater`, { withCredentials: true });
                console.log(response.data);
                
                setTheaters(response.data);
            } catch (error) {
                console.error("Error fetching theaters", error.message);
                toast.error("Failed to fetch theaters");
            }
        };

        fetchMovies();
        fetchTheaters();
    }, []);

    useEffect(() => {
        if (selectedMovie) {
            const movie = movies.find(movie => movie._id === selectedMovie);
            if (movie) {
                setMinDate(new Date(movie.releaseDate));
            }
        }
    }, [selectedMovie, movies]);

    useEffect(() => {
        if (selectedMovieId) {
            const selectedMovie = movies.find(movie => movie._id === selectedMovieId);
            if (selectedMovie) {
                setMinDate(new Date(selectedMovie.releaseDate));
                setValue('movieId', selectedMovieId);
            }
        }
    }, [selectedMovieId, movies, setValue]);

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const parsedDate = new Date(data.dateTime);
            const showDate = format(parsedDate, 'yyyy-MM-dd');
            const showTime = format(parsedDate, 'hh:mm aa');

            const formattedData = {
                ...data,
                showDate,
                showTime
            };

            const response = await axios.post(`${baseUrl}/api/owner/add-shows`, formattedData, { withCredentials: true });

            if (response.status === 201) {
                toast.success("Show added successfully!");
                reset();
                onClose();
                refreshShows();
            } else {
                toast.error(response.data.message || "Failed to add show");
            }
        } catch (error) {
            console.error("Error adding show:", error); 

        if (error.response) {
            console.error("Server response:", error.response);
        }
            if (error.response && error.response.status === 400 && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                console.error("Error adding show", error.message);
                toast.error("Failed to add show");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <>
            {isOpen && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg text-center">ADD SHOW</h3>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="overflow-x-auto">
                                <div className="my-3 text-center px-2">
                                    <label htmlFor="movieId" className="block text-left text-sm mb-2 font-medium">Select Movie</label>
                                    <select
                                        id="movieId"
                                        {...register('movieId')}
                                        className={`select select-bordered select-primary w-full ${errors.movieId ? 'border-error' : ''}`}
                                        disabled={!!selectedMovieId}
                                    >
                                        <option value="">Select a movie</option>
                                        {movies.map(movie => (
                                            <option key={movie._id} value={movie._id}>
                                                {movie.title} ({new Date(movie.releaseDate).getFullYear()})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.movieId && <p className="text-left text-error block text-sm mt-1 ml-2">{errors.movieId.message}</p>}
                                </div>
                                <div className="my-3 text-center px-2">
                                    <label htmlFor="theaterId" className="block text-left text-sm mb-2 font-medium">Select Theater</label>
                                    <select
                                        id="theaterId"
                                        {...register('theaterId')}
                                        className={`select select-bordered select-primary w-full ${errors.theaterId ? 'border-error' : ''}`}
                                    >
                                        <option value="">Select a theater</option>
                                        {theaters.map(theater => (
                                            <option key={theater._id} value={theater._id}>
                                                {theater.name.toUpperCase()} ({theater.location.toLowerCase()})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.theaterId && <p className="text-left text-error block text-sm mt-1 ml-2">{errors.theaterId.message}</p>}
                                </div>
                                <div className="flex flex-col md:flex-row">
                                    <div className="my-3 text-center w-full md:w-1/2 px-2">
                                        <label htmlFor="price" className="block text-left text-sm mb-2 font-medium">Ticket Price</label>
                                        <input
                                            type="text"
                                            id="price"
                                            placeholder="Ticket Price"
                                            {...register('price')}
                                            className={`input input-bordered input-primary w-full ${errors.price ? 'border-error' : ''}`}
                                        />
                                        {errors.price && <p className="text-left text-error block text-sm mt-1 ml-2">{errors.price.message}</p>}
                                    </div>
                                    <div className="my-3 text-center w-full md:w-1/2 px-2">
                                        <label htmlFor="dateTime" className="block text-left text-sm mb-2 font-medium">Show Date and Time</label>
                                        <Controller
                                            control={control}
                                            name="dateTime"
                                            render={({ field }) => (
                                                <DatePicker
                                                    disabled={!selectedMovie}
                                                    selected={field.value}
                                                    onChange={field.onChange}
                                                    showTimeSelect
                                                    minTime={setHours(setMinutes(new Date(), 0), 6)}
                                                    maxTime={setHours(setMinutes(new Date(), 0), 23)}
                                                    timeIntervals={90}
                                                    dateFormat="dd/MM/yyyy h:mm aa"
                                                    minDate={minDate}
                                                    placeholderText="Select date and time"
                                                    className="input input-bordered input-primary w-full"
                                                    wrapperClassName="w-full"
                                                />
                                            )}
                                        />
                                        {errors.dateTime && <p className="text-left text-error block text-sm mt-1 ml-2">{errors.dateTime.message}</p>}
                                    </div>
                                </div>
                                <div className="text-center px-2 mt-2">
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {loading ? <span className='loading loading-spinner bg-primary'></span> : "Add Show"}
                                    </button>
                                </div>
                            </div>
                        </form>

                        <div className="modal-action">
                            <button className="btn" onClick={handleClose}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddShowModel;