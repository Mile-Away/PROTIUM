'use client';
import { useMemo } from 'react';
import StarUniverse from './StarUniverse';
import TypeWriter from './TypeWriter';

const Page = () => {
  const memoizedAComponent = useMemo(() => {
    return <StarUniverse />;
  }, []);
  return (
    <div className="relative">
      <TypeWriter />

      <div className=" absolute bottom-0 top-0 z-0 ">
        {memoizedAComponent}
      </div>
    </div>
  );
};

export default Page;
