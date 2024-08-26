import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import toast from 'react-hot-toast';
import { baseUrl } from '../URL/baseUrl.js';


const schema = yup.object().shape({
    rating: yup.number().required('Rating is required').min(1).max(5),
    review: yup.string().max(50).optional(),
    
  });

function Review({ isOpen, onClose, movieId, movieName }) {
    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
      });
      const [loading, setLoading] = useState(false);
      const onSubmit = async(data) => {
        setLoading(true);
        try {
          
          await axios.post(`${baseUrl}/api/user/add-review`, { ...data, movieId },{ withCredentials: true });
          toast.success('Review added succesfully')
          reset();
          onClose();
        } catch (error) {
          console.error('Error submitting review:', error);
        } finally {
          setLoading(false);
        }
      };
      const handleClose = () => {
        reset();
        onClose();
      };

      



  return (
    <div className={`modal ${isOpen ? 'modal-open ' : ''}`}>
    <div className="modal-box">
      <h2 className="font-bold text-lg">Add Review : {movieName}</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="py-4 text-center">
          <Controller
            name="rating"
            control={control}
            defaultValue={undefined}
            render={({ field }) => (
              <div className="rating rating-md ">
                {[1, 2, 3, 4, 5].map((value) => (
                  <input
                    key={value}
                    type="radio"
                    name="rating"
                    className={`mask mask-star-2 ${field.value >= value ? 'bg-warning' : 'bg-neutral-content'} text-3xl`}
                    checked={field.value === value}
                    onChange={() => field.onChange(value)}
                  />
                ))}
              </div>
            )}
          />
          {errors.rating && <p className="text-error">{errors.rating.message}</p>}
          <Controller
            name="review"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <div>
                <textarea
                  {...field}
                  className="textarea textarea-bordered w-full mt-4"
                  placeholder="Write your review here (optional)..."
                ></textarea>
                {errors.review && <p className="text-error">{errors.review.message}</p>}
              </div>
            )}
          />
        </div>
        <div className="modal-action">
          <button type="button" className="btn" onClick={handleClose}>Cancel</button>
          <button className="btn btn-primary" disabled={loading}>{loading ? <span className='loading loading-spinner bg-primary '></span> : "Submit Review"}</button>
        </div>
      </form>
    </div>
  </div>
  )
}

export default Review