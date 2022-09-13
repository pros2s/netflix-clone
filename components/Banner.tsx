import Image from 'next/image';
import { FC, memo, useEffect, useState } from 'react';
import { FaPlay } from 'react-icons/fa';
import { InformationCircleIcon } from '@heroicons/react/solid';

import { baseUrl } from '../constants/movie';
import { useTypedDispatch } from '../hooks/useTypedDispatch';
import { openModal } from '../store/slices/modal';
import { setCurrentMovie } from '../store/slices/movie';
import { Movie } from '../types';

interface BannerProps {
  netflixOriginals: Movie[];
}

const Banner: FC<BannerProps> = memo(({ netflixOriginals }) => {
  const dispatch = useTypedDispatch();
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    setMovie(netflixOriginals[Math.floor(Math.random() * netflixOriginals.length)]);
  }, [netflixOriginals]);

  return (
    <div className='flex flex-col space-y-2 py-16 md:space-y-4 lg:h-[65vh] lg:justify-end lg:pb-12'>
      <div className='absolute left-0 top-0 -z-10 h-[95vh] w-[100%]'>
        <Image
          src={`${baseUrl}${movie?.backdrop_path || movie?.poster_path}`}
          layout='fill'
          priority
          objectFit='cover'
        />
      </div>

      <h1 className='text-2xl font-bold md:text-4xl lg:text-5xl'>
        {movie?.title || movie?.name || movie?.original_name}
      </h1>

      <p className='max-w-xs text-xs text-shadow-md max-h-28 overflow-hidden md:max-h-36 md:max-w-lg md:text-lg lg:max-w-2xl lg:text-2xl lg:max-h-48'>
        {movie?.overview}
      </p>

      <div className='flex space-x-3'>
        <button className='bannerButton bg-white text-black'>
          <FaPlay className='h-4 w-4 text-black md:h-7 md:w-7' />{' '}
          <p className='defaultText line-through'>Play</p>
        </button>
        <button
          className='bannerButton bg-[gray]/70'
          onClick={() => {
            dispatch(openModal());
            movie && dispatch(setCurrentMovie(movie));
          }}>
          <p className='defaultText'>More Info</p>{' '}
          <InformationCircleIcon className='h-5 w-5 md:h-8 md:w-8' />
        </button>
      </div>
    </div>
  );
});

export default Banner;
