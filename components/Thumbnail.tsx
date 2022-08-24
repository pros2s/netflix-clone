import { FC } from 'react';
import Image from 'next/image';

import { useTypedDispatch } from '../hooks/useTypedDispatch';
import { openModal } from '../store/slices/modal';
import { setCurrentMovie } from '../store/slices/movie';
import { Movie } from '../types';

interface ThumbnailProps {
  movie: Movie;
}

const Thumbnail: FC<ThumbnailProps> = ({ movie }) => {
  const dispatch = useTypedDispatch();

  return (
    <div
      onClick={() => {
        dispatch(openModal());
        movie && dispatch(setCurrentMovie(movie));
      }}
      className='relative h-28 min-w-[180px] cursor-pointer transition duration-200 ease-out md:h-36 md:min-w-[260px] md:hover:scale-105'>
      <Image
        src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path || movie.poster_path}`}
        className='rounded-sm object-cover md:rounded'
        layout='fill'
        alt={movie?.name || movie?.original_name}
      />
    </div>
  );
};

export default Thumbnail;
