import React, { useEffect, useState } from 'react';
import { format, isValid } from 'date-fns';

function ShowReview({ reviews }) {
  console.log("reviews prop:", reviews);
  const [hasReviews, setHasReviews] = useState(true);

  useEffect(() => {
    if (!reviews || reviews.length === 0) {
      setHasReviews(false);
    } else {
      setHasReviews(true);
    }
  }, [reviews]);

  return (
    <div className="container mx-auto pt-20 md:px-10">
      <h1 className="text-4xl font-bold mb-6 text-center">Reviews</h1>
      {hasReviews ? (
        <div className="space-y-4">
          {reviews.map(review => {
            // Handle invalid or undefined dates
            const reviewDate = new Date(review.date);
            const formattedDate = isValid(reviewDate) ? format(reviewDate, 'dd MMMM yyyy') : 'Date not available';

            return (
              <div key={review._id} className="card bg-base-100 p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-xl text-neutral-content">
                    {review.user?.name
                      ? review.user.name.charAt(0).toUpperCase() + review.user.name.slice(1).toLowerCase()
                      : 'Anonymous'}
                  </p>
                  <div className="flex items-center">
                    <div className="rating rating-sm gap-1 pointer-events-none">
                      {[1, 2, 3, 4, 5].map((star, index) => (
                        <input
                          key={index}
                          type="radio"
                          name={`rating-${review._id}`}
                          disabled
                          className={`mask mask-star-2 ${index < review.rating ? 'bg-warning' : ''}`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-gray-600">{review.rating} out of 5</span>
                  </div>
                </div>

                <p className="mb-4 text-lg text-gray-700 break-words">{review.review || 'No review text'}</p>
                <p className="text-gray-500 text-sm">{formattedDate}</p>
                <div className="divider"></div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card bg-base-100 p-6 mb-10 rounded-lg text-center shadow-md">
          <p className="text-lg text-gray-700">No reviews yet 😞</p>
          <div className="divider"></div>
        </div>
      )}
    </div>
  );
}

export default ShowReview;
