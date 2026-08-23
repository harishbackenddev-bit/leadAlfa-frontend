import React from 'react';

export default function CustomerReviews({ reviews = [] }) {
  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        <svg
          className="w-5 h-5 text-yellow-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <span className="text-sm font-semibold text-gray-900">
          {rating.toFixed(1)}<span className="text-gray-400 font-normal">/5</span>
        </span>
      </div>
    );
  };

  return (
    <div className="px-2 pt-6 sm:px-4 lg:px-6 py-4 pb-4">
      <h2 className="text-2xl md:text-3xl font-extrabold uppercase font-anton text-gray-900 mb-8">
        Customers Reviews
      </h2>
      
      <div className="space-y-4">
        {reviews.map((review, index) => (
          <div
            key={index}
            className="bg-[#F0F0F0] rounded-2xl p-6 flex gap-2"
          >
            <img
              src={review.avatar}
              alt={review.name}
              className="w-12 h-12 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{review.name}</h3>
                {renderStars(review.rating)}
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                {review.comment}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
