import React from 'react';

interface WishProps {
  onPrevClick: () => void;
  onNextClick: () => void;
}

const Banner: React.FC<WishProps> = ({ onPrevClick, onNextClick }) => {
  return (
    <div className="bg-teal-100 flex items-center justify-center h-72">
      <div className="relative">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 transform">
          <button
            onClick={onPrevClick}
            className="bg-black text-white rounded-full p-2 hover:bg-gray-700 transition-colors duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md max-w-md mx-auto">
          <p className="text-lg font-semibold">Did you make a wish?</p>
          <p className="mt-2">
            Time to make it come true.{' '}
            <a
              href="#"
              className="text-blue-600 hover:text-blue-800 transition-colors duration-300"
            >
              Get the courses on your wishlist
            </a>{' '}
            and take the first step toward your goals.
          </p>
        </div>
        <div className="absolute top-1/2 right-0 -translate-y-1/2 transform">
          <button
            onClick={onNextClick}
            className="bg-black text-white rounded-full p-2 hover:bg-gray-700 transition-colors duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 transform">
          <img
            src="/wish-illustration.png"
            alt="Wish Illustration"
            className="h-48"
          />
        </div>
      </div>
    </div>
  );
};

export default Banner;