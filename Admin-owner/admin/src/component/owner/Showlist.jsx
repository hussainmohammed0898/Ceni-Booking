import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import AddShowModel from './AddShowModel';
import { baseUrl } from '../../URL/baseUrl.js';
import { Link } from 'react-router-dom';

const ShowList = () => {
    const [shows, setShows] = useState([]);
    const [filteredShows, setFilteredShows] = useState([]);
    const [theaterFilter, setTheaterFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [movieSearch, setMovieSearch] = useState('');
    const [theaters, setTheaters] = useState([]);
    const [showFilterOptions, setShowFilterOptions] = useState(false);
    const [showModel, setShowModel] = useState(false);

    useEffect(() => {
        const fetchShows = async () => {
            try {
                const res = await axios.get(`${baseUrl}/api/owner/get-shows`, { withCredentials: true });
                setShows(res.data);
                setFilteredShows(res.data);
            } catch (error) {
                console.log('Error fetching shows:', error.message);
                if (error.response && error.response.status === 404) {
                    toast.error("No theaters found for this owner");
                } else {
                    toast.error('Failed to fetch shows');
                }
            }
        };

        const fetchTheaters = async () => {
            try {
                const res = await axios.get(`${baseUrl}/api/owner/select-theater`, { withCredentials: true });
                setTheaters(res.data);
            } catch (error) {
                console.log('Error fetching theaters:', error.message);
                toast.error('Failed to fetch theaters');
            }
        };

        fetchShows();
        fetchTheaters();
    }, []);

    const handleFilter = () => {
        let filtered = shows;
        if (theaterFilter) {
            filtered = filtered.filter(show => show.theaterName.toLowerCase().includes(theaterFilter.toLowerCase()));
        }
        if (dateFilter) {
            filtered = filtered.filter(show => format(new Date(show.showDate), 'yyyy-MM-dd') === dateFilter);
        }
        if (movieSearch) {
            filtered = filtered.filter(show => show.movieName.toLowerCase().includes(movieSearch.toLowerCase()));
        }
        setFilteredShows(filtered);
    };

    useEffect(() => {
        handleFilter();
    }, [theaterFilter, dateFilter, movieSearch, shows]);

    const handleOpenModal = () => {
        setShowModel(true);
    };

    const handleCloseModal = () => {
        setShowModel(false);
    };

    const refreshShows = async () => {
        try {
            const res = await axios.get(`${baseUrl}/api/owner/get-shows`, { withCredentials: true });
            console.log("responds:", res.data);
            


            setShows(res.data);
            setFilteredShows(res.data);
        } catch (error) {
            console.log('Error refreshing shows:', error.message);
            toast.error('Failed to refresh shows');
        }
    };

    const clearFilters = () => {
        setTheaterFilter('');
        setDateFilter('');
        setMovieSearch('');
        setFilteredShows(shows);
    };

    return (
        <div className="container mx-auto my-4">
            <div className="card w-full p-1 shadow-xl animate-fade-in-down">
                <div className="card-title flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Shows</h2>
                    <div className="flex items-center gap-2">
                        <input
                            className="input input-bordered input-sm hidden md:block"
                            placeholder="Search Movie"
                            value={movieSearch}
                            onChange={e => setMovieSearch(e.target.value)}
                        />
                        <button className="input input-bordered input-sm w-24 hidden md:block" onClick={() => setShowFilterOptions(!showFilterOptions)}>
                            Filter
                        </button>
                        <button className="btn btn-success text-primary-content w-32" onClick={() => handleOpenModal()}>
                            Add
                        </button>
                    </div>
                </div>
                {showFilterOptions && (
                    <div className="my-4 flex gap-2">
                        <select
                            className="select select-bordered select-sm"
                            value={theaterFilter}
                            onChange={e => setTheaterFilter(e.target.value)}
                        >
                            <option value="">Select Theater</option>
                            {theaters.map(theater => (
                                <option key={theater._id} value={theater.name}>{theater.name}</option>
                            ))}
                        </select>
                        <input
                            type="date"
                            className="input input-bordered input-sm"
                            value={dateFilter}
                            onChange={e => setDateFilter(e.target.value)}
                        />
                        <button className="btn btn-outline btn-sm" onClick={clearFilters}>
                            Clear Filter
                        </button>
                    </div>
                )}
                <div className="divider mt-2"></div>
                <div className="h-full min-h-screen overflow-x-auto bg-base-200 rounded-xl">
                    <table className="table">
                        <thead className="text-lg">
                            <tr>
                                <th>Movie</th>
                                <th>Theater</th>
                                <th>Show Date</th>
                                <th>Show Time</th>
                                <th>Price (Rs)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredShows.map((show) => {
                                const showDateTime = new Date(show.showDate);
                                if (isNaN(showDateTime)) {
                                    console.error("Invalid show date:", show.showDate);
                                    return null;
                                }
                                return (
                                    <tr key={show.id} className="border-t border-base-100">
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="avatar">
                                                    <div className="mask mask-squircle w-12 h-12">
                                                        <img src={show.movieImage} alt={show.movieName} className="object-cover" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="font-bold">{show.movieName}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{show.theaterName}</td>
                                        <td>{format(showDateTime, 'dd MMMM yyyy')}</td>
                                        <td>{format(showDateTime, 'hh:mm aa')}</td>
                                        <td>{show.price}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            <AddShowModel
                isOpen={showModel}
                onClose={handleCloseModal}
                refreshShows={refreshShows}
            />
        </div>
    );
};

export default ShowList;
