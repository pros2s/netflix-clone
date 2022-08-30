import { FC, useEffect, useRef, useState } from 'react';
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
  const [isLineSingle, setIsLineSingle] = useState<boolean>(false);

  const handleClick = (direction: string) => {
    setIsMoved(true);

    const { scrollLeft, clientWidth } = rowRef.current!;

    const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;

    rowRef.current?.scrollTo({ left: scrollTo, behavior: 'smooth' });
  };

  return (
    <>
      {movies.length > 0 && (
        <div className='relative h-24 md:space-y-2'>
          <h2 className='absolute top-0 w-56 font-semibold text-sm cursor-pointer text-[#e5e5e5] transition duration-200 hover:text-white md:text-2xl'>
            {title}
          </h2>

          <div className='group relative'>
            <button
              className={`chevronButton -left-16 hover:bg-gradient-to-r from-gray-900 ${
                !isMoved && 'hidden'
              }
              ${isLineSingle && 'hidden hover:hidden'}`}
              onClick={() => handleClick('left')}>
              <ChevronLeftIcon />
            </button>

            <div
              ref={rowRef}
              className='flex -mx-[60px] overflow-y-hidden h-80 items-center space-x-0.5 overflow-x-scroll scrollbar-hide md:space-x-5'>
              {movies.map((movie, i) => (
                <Thumbnail key={movie.id} movie={movie} index={i} rowLength={movies.length} />
              ))}
            </div>

            <button
              className={`chevronButton -right-16 hover:bg-gradient-to-l from-gray-900
              ${isLineSingle && 'hidden hover:hidden'}`}
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
