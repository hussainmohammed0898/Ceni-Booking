import React, { useEffect, useState } from 'react'
import { format } from 'date-fns';

function ShowReview({ reviews }) {
    const [isReview, setIsReview] = useState(true);

    useEffect(() => {
      if (!reviews || reviews.length === 0) {
        setIsReview(false);
      } else {
        setIsReview(true);
      }
    }, [reviews]);
  

  return (
    <div className="container mx-auto pt-20 md:px-10">
    <h1 className="text-4xl font-bold mb-6 text-center ">Reviews</h1>
    {isReview ? (
      <div className="space-y-4">
        {reviews.map(review => (
          <div key={review._id} className="card bg-base-100 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <p className="text-xl text-neutral-content">
                {review.userId.name.charAt(0).toUpperCase() + review.userId.name.slice(1).toLowerCase()}
              </p>
              <div className="flex items-center">
                <div className="rating rating-sm gap-1 pointer-events-none">
                  {[1, 2, 3, 4, 5].map((star, index) => (
                    <input
                      key={index}
                      type="radio"
                      name={`rating-${review._id}`}
                      disabled
                      className={`mask mask-star-2 ${index < review.rating ? 'bg-warning' : ''} ${index < review.rating ? 'checked' : ''}`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-gray-600 ">{review.rating} out of 5</span>
              </div>
            </div>
            
            <p className="mb-4 text-lg text-gray-700 break-words ">{review.review}</p>
            <p className="text-gray-500 text-sm">{format(new Date(review.date), 'dd MMMM yyyy')}</p>
            <div className="divider"></div>
          </div>
        ))}
      </div>
    ) : (
      <>
      <div className="card bg-base-100 p-6 mb-10 rounded-lg text-center">
        <p className="text-lg text-gray-700 break-words">No reviews yet 😞</p>
        <div className="divider"></div>
      </div>
      
      </>
    )}
  </div>  
  );
}

export default ShowReview