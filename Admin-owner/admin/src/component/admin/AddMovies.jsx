import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
import { baseUrl } from '../../URL/baseUrl.js';

const movieSchema = Yup.object().shape({
  title: Yup.string().required("Enter movie title"),
  duration: Yup.number().typeError("Duration must be a number").required("Enter movie duration in minutes"),
  genre: Yup.string().required("Enter movie genre"),
  description: Yup.string().required("Enter movie description").max(400),
  language: Yup.string().required("Enter movie language"),
  actorName: Yup.string().required("Enter actor name language"),
  director: Yup.string().required("Enter director name language"),
  image: Yup.mixed().required("Upload movie image"),
  releaseDate: Yup.date().required('Release date is required'),
});

export default function AddMovies({ isOpen, onClose, addMovie }) {
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm({
    resolver: yupResolver(movieSchema),
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    console.log(data, 'Movie Data');
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('genre', data.genre);
      formData.append('language', data.language);
      formData.append('actorName', data.actorName);
      formData.append('director', data.director);
      formData.append('duration', data.duration);
      formData.append('description', data.description);
      formData.append('releaseDate', format(new Date(data.releaseDate), 'yyyy-MM-dd'));
      formData.append('image', data.image[0]);

      const response = await axios.post(`${baseUrl}/api/admin/add-movies`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      toast.success('Movie added successfully');
      addMovie(response.data.movie);
      reset();
      onClose();
    } catch (error) {
      console.error('Error adding movie:', error.message);
      toast.error('Failed to add movie');
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
      <div className={`modal ${isOpen ? 'modal-open ' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg text-center">ADD MOVIE</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='overflow-x-auto'>
              <div className="my-3 text-center px-2 mb-5">
                <label htmlFor="title" className="block text-left text-sm mb-2 font-medium ">Title</label>
                <input type="text" placeholder="Title" className="input input-bordered input-primary w-full "
                  {...register("title")} />
                {errors.title && (
                  <span className="text-left text-error block text-sm mt-1 ml-2">
                    {errors.title.message}
                  </span>
                )}
              </div>
              <div className="my-3 text-center px-2 mb-5">
                <label htmlFor="genre" className="block  text-left  text-sm mb-2 font-medium">Genre</label>
                <input type="text" placeholder="Genre" className="input input-bordered input-primary  w-full"
                  {...register("genre")} />
                {errors.genre && (
                  <span className="text-left text-error block text-sm mt-1 ml-2">
                    {errors.genre.message}
                  </span>
                )}
              </div>
              <div className="my-3 text-center px-2 mb-5">
                <label htmlFor="language" className="block text-left  text-sm mb-2 font-medium ">Language</label>
                <input type="text" placeholder="Language" className="input input-bordered input-primary w-full "
                  {...register("language")} />
                {errors.language && (
                  <span className="text-left text-error block text-sm mt-1 ml-2">
                    {errors.language.message}
                  </span>
                )}
              </div>
              <div className="my-3 text-center px-2 mb-5">
                <label htmlFor="language" className="block text-left  text-sm mb-2 font-medium ">Actor Name</label>
                <input type="text" placeholder="Actor Name" className="input input-bordered input-primary w-full "
                  {...register("actorName")} />
                {errors.actorName && (
                  <span className="text-left text-error block text-sm mt-1 ml-2">
                    {errors.actorName.message}
                  </span>
                )}
              </div>
              <div className="my-3 text-center px-2 mb-5">
                <label htmlFor="language" className="block text-left  text-sm mb-2 font-medium ">Director Name</label>
                <input type="text" placeholder="Director Name" className="input input-bordered input-primary w-full "
                  {...register("director")} />
                {errors.director && (
                  <span className="text-left text-error block text-sm mt-1 ml-2">
                    {errors.director.message}
                  </span>
                )}
              </div>
              <div className='flex flex-col md:flex-row'>
                <div className="my-3 text-center w-full md:w-1/2 px-2">
                  <label htmlFor="duration" className="block text-left text-sm mb-2 font-medium">Duration (Minutes)</label>
                  <input type="number" placeholder="Duration (Minutes)" className="input input-bordered input-primary w-full"
                    {...register("duration")} />
                  {errors.duration && (
                    <span className="text-left text-error block text-sm mt-1 ml-2">
                      {errors.duration.message}
                    </span>
                  )}
                </div>
                <div className="my-3 text-center w-full md:w-1/2 px-2">
                  <label htmlFor="releaseDate" className="block text-left text-sm mb-2 font-medium">Release Date</label>
                  <Controller
                    control={control}
                    name="releaseDate"
                    render={({ field }) => (
                      <DatePicker
                        selected={field.value}
                        onChange={(date) => field.onChange(date)}
                        minDate={new Date()}
                        dateFormat="yyyy/MM/dd"
                        placeholderText="Select release date"
                        className="input input-bordered input-primary w-full"
                        wrapperClassName="w-full"
                      />
                    )}
                  />
                  {errors.releaseDate && (
                    <span className="text-left text-error block text-sm mt-1 ml-2">
                      {errors.releaseDate.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="my-3 text-center px-2">
                <label htmlFor="description" className="block text-left mb-2 text-sm font-medium ">Description</label>
                <textarea
                  id="description"
                  {...register('description')}
                  placeholder='Description'
                  className='input input-bordered input-primary w-full h-16'
                />
                {errors.description && (
                  <span className="text-left text-error block text-sm mt-1 ml-2">
                    {errors.description.message}
                  </span>
                )}
              </div>
              <div className="mb-3 text-center px-2">
                <label htmlFor="image" className="block text-left mb-2 text-sm font-medium ">Image</label>
                <input type="file" className="file-input file-input-bordered file-input-primary w-full"
                  name='image' id="image"
                  {...register('image')} />
                {errors.image && (
                  <span className="text-left text-error block text-sm mt-1 ml-2">
                    {errors.image.message}
                  </span>
                )}
              </div>
              <div className="text-center px-2 mt-2">
                <button className="btn btn-success" disabled={loading}>{loading ? <span className='loading loading-spinner bg-primary '></span> : "Add Movie"}</button>
              </div>
            </div>
          </form>

          <div className="modal-action">
            <button className="btn btn-error" onClick={handleClose}>Cancel</button>
          </div>
        </div>
      </div>
    </>
  );
}