import React from 'react';

interface CourseProps {
  title: string;
  description: string;
  instructor: string;
  updatedDate: string;
  totalHours: number;
  lectureCount: number;
  level: string;
  rating: number;
  ratingCount: number;
  price: number;
  originalPrice: number;
}

const TopPicker: React.FC<CourseProps> = ({
  title,
  description,
  instructor,
  updatedDate,
  totalHours,
  lectureCount,
  level,
  rating,
  ratingCount,
  price,
  originalPrice,
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg">
      <div className="flex items-center p-4">
        <div className="w-32 h-24 bg-purple-500 rounded-lg flex-shrink-0 mr-4"></div>
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-gray-600">{description}</p>
          <div className="mt-2 text-sm text-gray-500">
            By {instructor} | Updated {updatedDate} | {totalHours} total hours ·{' '}
            {lectureCount} lectures · {level}
          </div>
          <div className="mt-1 flex items-center">
            {/* Rating stars */}
            <span className="text-yellow-500">{rating.toFixed(1)}</span>
            <span className="text-gray-500 ml-1">({ratingCount})</span>
          </div>
        </div>
      </div>
      <div className="bg-gray-100 p-4 flex justify-between items-center rounded-b-lg">
        <span className="text-green-600 font-semibold">${price}</span>
        <span className="text-gray-500 line-through">${originalPrice}</span>
      </div>
    </div>
  );
};

export default TopPicker;