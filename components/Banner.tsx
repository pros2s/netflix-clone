import { FC, memo, useEffect, useState } from 'react';
import Image from 'next/image';

import BannerBTNs from './UI/BannerBTNs';

import { baseUrl } from '../constants/movie';
import { Movie } from '../types';

interface BannerProps {
  netflixOriginals: Movie[];
}

const Banner: FC<BannerProps> = memo(({ netflixOriginals }) => {
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

      <BannerBTNs movie={movie} />
    </div>
  );
});

export default Banner;
