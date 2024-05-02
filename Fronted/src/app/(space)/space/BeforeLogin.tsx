'use client';
import React from 'react';
import Carousel from './Carousel';
import renderStarRating from './StarIcons';
import TopPicker from './TopPicker';
interface Course {
  title: string;
  author: string;
  rating: number;
  ratingCount: number;
  price: number;
  salePrice: number;
  isBestseller: boolean;
  imageUrl: string;
}
const recommendedCourses: Course[] = [
  {
    title:
      'DeePMD-kit: A deep learning package for many-body potential energy representation and molecular dynamics',
    author: 'Academind by Maximilian Schwarzmüller',
    rating: 4.6,
    ratingCount: 209574,
    price: 22.99,
    salePrice: 124.99,
    isBestseller: true,
    imageUrl: 'path/to/react-complete-guide-image.jpg',
  },
  {
    title: 'Modern React with Redux [2024 Update]',
    author: 'Stephen Grider',
    rating: 3.7,
    ratingCount: 86310,
    price: 13.99,
    salePrice: 179.99,
    isBestseller: false,
    imageUrl: 'path/to/modern-react-redux-image.jpg',
  },
  {
    title: "Next JS: The Complete Developer's Guide",
    author: 'Stephen Grider',
    rating: 4.8,
    ratingCount: 1264,
    price: 12.99,
    salePrice: 84.99,
    isBestseller: true,
    imageUrl: 'path/to/nextjs-complete-guide-image.jpg',
  },
  {
    title: 'Complete React Developer (w/ Redux, Hooks, GraphQL)',
    author: 'Andrei Neagoie, Yihua Zhang',
    rating: 4.5,
    ratingCount: 28173,
    price: 16.99,
    salePrice: 94.99,
    isBestseller: false,
    imageUrl: 'path/to/complete-react-developer-image.jpg',
  },
  {
    title: '100 Days of Code: The Complete Python Pro Bootcamp',
    author: 'Dr. Angela Yu',
    rating: 4.7,
    ratingCount: 290758,
    price: 12.99,
    salePrice: 74.99,
    isBestseller: true,
    imageUrl: 'path/to/100-days-python-image.jpg',
  },
];

const searchResults: Course[] = [
  {
    title: 'Learn to build an e-commerce app with .Net Core and Angular',
    author: 'Neil Cummings',
    rating: 4.5,
    ratingCount: 3934,
    price: 12.99,
    salePrice: 74.99,
    isBestseller: true,
    imageUrl: 'path/to/ecommerce-app-image.jpg',
  },
  {
    title: 'Learn Parallel Programming with C# and .NET',
    author: 'Dmitri Nesteruk',
    rating: 4.6,
    ratingCount: 3830,
    price: 13.99,
    salePrice: 179.99,
    isBestseller: true,
    imageUrl: 'path/to/parallel-programming-image.jpg',
  },
  {
    title: 'Learn to build an e-commerce store with .Net, React & Redux',
    author: 'Neil Cummings',
    rating: 4.6,
    ratingCount: 1612,
    price: 12.99,
    salePrice: 74.99,
    isBestseller: true,
    imageUrl: 'path/to/ecommerce-store-image.jpg',
  },
  {
    title: '.NET/ C# Interview Masterclass + Top 500 Questions & Answers',
    author: 'Happy Ravat',
    rating: 4.6,
    ratingCount: 1153,
    price: 13.99,
    salePrice: 74.99,
    isBestseller: true,
    imageUrl: 'path/to/dotnet-interview-masterclass-image.jpg',
  },
  {
    title: 'Getting Started with .NET Core Clean Architecture',
    author: 'Manish Narayan',
    rating: 4.5,
    ratingCount: 2253,
    price: 12.99,
    salePrice: 44.99,
    isBestseller: false,
    imageUrl: 'path/to/dotnet-core-clean-architecture-image.jpg',
  },
];

const courseData = {
  title: 'Crash Course: Build a Full-Stack Web App in a Weekend!',
  description:
    'A quick, fun, and hands-on introduction to web development. Build a complete app with HTML, CSS, JavaScript, and React!',
  instructor: 'Jonas Schmedtmann',
  updatedDate: 'November 2023',
  totalHours: 12.5,
  lectureCount: 71,
  level: 'Beginner',
  rating: 4.7,
  ratingCount: 2654,
  price: 13.99,
  originalPrice: 79.99,
};

const BeforeLogin: React.FC = () => {
  const handlePrevClick = () => {
    // Implement your previous logic here
    console.log('Previous clicked');
  };

  const handleNextClick = () => {
    // Implement your next logic here
    console.log('Next clicked');
  };

  return (
    <div className="container mx-auto my-32 dark:bg-neutral-900">
      <div className="my-24">
        <Carousel images={[]} />
      </div>

      {/* Personal Recommand */}

      {/* Social Recommand */}
      <div className="my-12">
        <h1 className="mb-8 font-display text-4xl font-semibold text-indigo-600 dark:text-indigo-400">
          What to explore next
        </h1>
        <h2 className="mb-4 text-2xl font-bold text-neutral-800 dark:text-neutral-200">
          Our top pick for you
        </h2>
      
      </div>
      <div>
        <h2 className="mb-4 text-2xl font-bold text-neutral-800 dark:text-neutral-200">
          Recommended for you
        </h2>
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {recommendedCourses.map((course, index) => (
            <div
              key={index}
              className="rounded-lg bg-white shadow-md dark:bg-neutral-800"
            >
              <img
                src={course.imageUrl}
                alt={course.title}
                className="h-40 w-full rounded-t-lg object-cover"
              />
              <div className="p-4">
                <h3 className="mb-2 line-clamp-3 text-lg font-semibold text-neutral-800 dark:text-white">
                  {course.title}
                </h3>
                <p className="mb-2 text-sm text-neutral-600 dark:text-neutral-400">
                  {course.author}
                </p>
                <div className="mb-2 flex items-center">
                  {renderStarRating(course.rating)}
                  <span className="ml-1 text-sm text-neutral-600 dark:text-neutral-400">
                    ({course.ratingCount})
                  </span>
                </div>
                <div className="flex items-center">
                  {course.isBestseller && (
                    <span className="mr-2 rounded-full bg-indigo-600 px-2 py-1 text-xs font-semibold text-white dark:bg-indigo-400 dark:text-neutral-800">
                      Molecule Dynamics
                    </span>
                  )}
                  {/* <span className="text-sm text-neutral-600 line-through dark:text-neutral-400">
                  ${course.price}
                </span>
                <span className="ml-2 font-semibold text-indigo-600 dark:text-indigo-400">
                  ${course.salePrice}
                </span> */}
                </div>
              </div>
            </div>
          ))}
        </div>

        <h2 className="mb-4 text-2xl font-bold text-neutral-800 dark:text-neutral-200">
          Because you searched for{' '}
          <span className=" text-indigo-500 underline">"DeePMD"</span>
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {searchResults.map((course, index) => (
            <div
              key={index}
              className="rounded-lg bg-white shadow-md dark:bg-neutral-800"
            >
              <img
                src={course.imageUrl}
                alt={course.title}
                className="h-40 w-full rounded-t-lg object-cover"
              />
              <div className="p-4">
                <h3 className="mb-2 line-clamp-3 text-lg font-semibold text-neutral-800 dark:text-white">
                  {course.title}
                </h3>
                <p className="mb-2 text-sm text-neutral-600 dark:text-neutral-400">
                  {course.author}
                </p>
                <div className="mb-2 flex items-center">
                  {renderStarRating(course.rating)}
                  <span className="ml-1 text-sm text-neutral-600 dark:text-neutral-400">
                    ({course.ratingCount})
                  </span>
                </div>
                <div className="flex items-center">
                  {course.isBestseller && (
                    <span className="mr-2 rounded-full bg-indigo-600 px-2 py-1 text-xs font-semibold text-white dark:bg-indigo-400 dark:text-neutral-800">
                      Molecule Dynamics
                    </span>
                  )}
                  {/* <span className="text-sm text-neutral-600 line-through dark:text-neutral-400">
                ${course.price}
              </span>
              <span className="ml-2 font-semibold text-indigo-600 dark:text-indigo-400">
                ${course.salePrice}
              </span> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BeforeLogin;
