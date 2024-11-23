import React from 'react';

interface CourseProps {
  title: string;
  author: string;
  updatedDate: string;
  totalHours: number;
  lectures: number;
  level: string;
  rating: number;
  ratingCount: number;
  price: number;
  originalPrice: number;
}

const TopPicker: React.FC<CourseProps> = ({
  title,
  author,
  updatedDate,
  totalHours,
  lectures,
  level,
  rating,
  ratingCount,
  price,
  originalPrice,
}) => {
  return (
    <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-neutral-800">
      <div className="mb-4 flex items-center">
        <img
          src="/hero4-horizen.png"
          alt="Django Logo"
          className="mr-4 h-12 w-12"
        />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Django
        </h2>
      </div>
      <h3 className="mb-2 text-xl font-semibold text-gray-700 dark:text-gray-200">
        {title}
      </h3>
      <p className="mb-4 text-gray-600 dark:text-gray-400">
        Unlocking the Power of Asynchronous Task Processing with Python Celery
      </p>
      <div className="mb-4 flex items-center">
        <img
          src="path/to/author-avatar.png"
          alt="Author Avatar"
          className="mr-2 h-8 w-8 rounded-full"
        />
        <p className="text-gray-700 dark:text-gray-200">{author}</p>
      </div>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Updated {updatedDate} · {totalHours} total hours · {lectures} lectures ·{' '}
        {level}
      </p>
      <div className="mb-4 flex items-center">
        <div className="flex items-center">
          {[...Array(Math.floor(rating))].map((_, index) => (
            <svg
              key={index}
              className="mr-1 h-4 w-4 fill-current text-yellow-500"
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
          ))}
          {rating % 1 !== 0 && (
            <svg
              className="mr-1 h-4 w-4 fill-current text-yellow-500"
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
          )}
        </div>
        <p className="ml-1 text-gray-700 dark:text-gray-200">
          {rating.toFixed(1)} ({ratingCount})
        </p>
      </div>
      <div className="flex items-center">
        <p className="text-2xl font-bold text-gray-700 dark:text-gray-200">
          ${price}
        </p>
        <p className="ml-2 text-gray-500 line-through dark:text-gray-400">
          ${originalPrice}
        </p>
      </div>
    </div>
  );
};

export default TopPicker;
