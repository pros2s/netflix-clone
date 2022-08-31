import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { DocumentData } from 'firebase/firestore';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';

import { Movie } from '../types';
import Thumbnail from './Thumbnail';

interface RowProps {
  title: string;
  movies: DocumentData[] | Movie[];
}

const Row: FC<RowProps> = ({ movies, title }) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isMoved, setIsMoved] = useState<boolean>(false);

  const handleClick = useCallback((direction: string) => {
    setIsMoved(true);

    const { scrollLeft, clientWidth } = rowRef.current!;

    const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;

    rowRef.current?.scrollTo({ left: scrollTo, behavior: 'smooth' });
  }, [isMoved]);

  return (
    <>
      {movies.length > 0 && (
        <div className='relative h-44 md:h-24 md:space-y-2'>
          <h2 className='font-semibold text-lg mb-2 cursor-pointer transition duration-200 md:text-2xl md:absolute md:top-0 md:w-56'>
            {title}
          </h2>

          <div className='group relative'>
            <button
              className={`chevronButton -left-16  md:hover:bg-gradient-to-r from-gray-900 ${
                !isMoved && 'hidden'
              }`}
              onClick={() => handleClick('left')}>
              <ChevronLeftIcon />
            </button>

            <div
              ref={rowRef}
              className='flex overflow-y-hidden items-center space-x-3 overflow-x-scroll scrollbar-hide md:h-80 md:-mx-[60px] md:space-x-5'>
              {movies.map((movie, i) => (
                <Thumbnail key={movie.id} movie={movie} index={i} rowLength={movies.length} />
              ))}
            </div>

            <button
              className={`chevronButton -right-16  md:hover:bg-gradient-to-l from-gray-900`}
              onClick={() => handleClick('right')}>
              <ChevronRightIcon />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Row;
