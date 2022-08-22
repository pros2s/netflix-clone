import { FC } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';

import { Movie } from '../types';
import Thumbnail from './Thumbnail';

interface RowProps {
  title: string;
  movies: Movie[];
}

const Row: FC<RowProps> = ({ movies, title }) => {
  return (
    <div className='h-40 space-y-0.5 md:space-y-2'>
      <h2 className='w-56 font-semibold text-sm cursor-pointer text-[#e5e5e5] transition duration-200 hover:text-white md:text-2xl'>
        {title}
      </h2>

      <div className='group relative -ml-2'>
        <ChevronLeftIcon className='chevronIcon' />

        <div className='flex items-center space-x-0.5 overflow-x-scroll scrollbar-hide md:space-x-2.5 md:p-2'>
          {
            movies.map((movie) => (
              <Thumbnail key={movie.id} movie={movie}/>
            ))
          }
        </div>

        <ChevronRightIcon className='chevronIcon' />
      </div>
    </div>
  );
};

export default Row;
