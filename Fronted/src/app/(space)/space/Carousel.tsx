import React, { useEffect, useState } from 'react';

interface CarouselProps {
  images: string[];
}

const Carousel: React.FC<CarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      goToNext();
    }, 10000);

    return () => {
      clearTimeout(timer);
    };
  }, [currentIndex]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1,
    );
  };

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          className="flex max-h-96 transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images &&
            images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Carousel Image ${index + 1}`}
                className="ob h-auto w-full"
              />
            ))}
        </div>
      </div>
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 transform rounded-full bg-white bg-opacity-50 p-2 focus:outline-none dark:bg-black"
        onClick={goToPrevious}
      >
        <svg
          className="h-6 w-6 text-gray-800 dark:text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 transform rounded-full bg-white bg-opacity-50 p-2 focus:outline-none dark:bg-black"
        onClick={goToNext}
      >
        <svg
          className="h-6 w-6 text-gray-800 dark:text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
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
  );
};

export default Carousel;
