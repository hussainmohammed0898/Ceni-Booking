import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import SeatingPatternGenerator from './SeatingPattern';
import { useGeneratedSeatsStore } from '../../store/useGeneratedSeatsStore';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../URL/baseUrl.js';

const theaterSchema = Yup.object().shape({
    name: Yup.string().required('Theater Name is required'),
    location: Yup.string().required('Location is required'),
});

export default function AddTheater() {
    const [rows, setRows] = useState(5);
    const [columns, setColumns] = useState(10);
    const [seatingPattern, setSeatingPattern] = useState([]);
    const generatedSeats = useGeneratedSeatsStore((state) => state.generatedSeats);
    const setGeneratedSeats = useGeneratedSeatsStore((state) => state.setGeneratedSeats);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(theaterSchema),
    });

    const onSubmit = async (data) => {
        if (generatedSeats.length === 0) {
            toast.error('Please generate seating pattern.');
            return;
        }

        const formData = {
            name: data.name,
            location: data.location,
            selectedSeats: generatedSeats,
        };
        try {
            setLoading(true);
            const response = await axios.post(`${baseUrl}/api/owner/add-theater`, formData, { withCredentials: true });
            toast.success(response.data.message);
            setGeneratedSeats([]);
            navigate('/theaters/my-theaters');
        } catch (error) {
            console.error('Error adding theater:', error.message);
            toast.error('Failed to add theater.');
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-base-100 flex flex-col lg:justify-start pt-20 items-center animate-fade-in">
            <div className='bg-base-200 p-3 rounded-lg w-[100%] md:w-[100%] lg:w-[100%] xl:w-[80%] '>
                <h3 className="font-bold text-lg lg:text-3xl text-center">ADD THEATER</h3>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='overflow-x-auto'>
                        <div className="my-3 text-center px-2">
                            <label htmlFor="title" className="block text-left text-sm mb-2 font-medium">Theater Name</label>
                            <input type="text" placeholder="Theater Name" className="input input-bordered input-primary w-full"
                                {...register("name")} />
                            {errors.name && (
                                <span className="text-left text-error block text-sm mt-1 ml-2">
                                    {errors.name.message}
                                </span>
                            )}
                        </div>
                        <div className="my-3 text-center px-2">
                            <label htmlFor="location" className="block text-left text-sm mb-2 font-medium">Location</label>
                            <input type="text" placeholder="Location" className="input input-bordered input-primary w-full"
                                {...register("location")} />
                            {errors.location && (
                                <span className="text-left text-error block text-sm mt-1 ml-2">
                                    {errors.location.message}
                                </span>
                            )}
                        </div>
                        <div className="my-3 text-center px-2">
                            <div className="collapse">
                                <input type="checkbox" className="peer" />
                                <div className="collapse-title bg-primary text-primary-content peer-checked:bg-base-100 rounded-2xl">
                                    Generate Seating Pattern
                                </div>
                                <div className="collapse-content bg-base-200 border border-primary rounded-lg my-3 overflow-x-auto ">
                                    <SeatingPatternGenerator
                                        rows={rows}
                                        setRows={setRows}
                                        columns={columns}
                                        setColumns={setColumns}
                                        seatingPattern={seatingPattern}
                                        setSeatingPattern={setSeatingPattern}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="text-center px-2 mt-2 ">
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? <span className='loading loading-spinner bg-primary '></span> : "Add Theater"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}