import { memo, useState, useEffect } from 'react';
import { useFetch } from '../../../hooks/useFetch';

import { Genre, MovieProp } from '../../../types';

const ModalInfo = memo(({ movie }: MovieProp) => {
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { genresArr, trailerId } = await useFetch(movie);
      setGenres(genresArr);
    };

    fetchData();
  }, [movie]);

  return (
    <div className='flex space-x-16 rounded-b-md bg-[#181818] p-4 md:px-10 md:py-8'>
      <div className='space-y-6 text-lg'>
        <ul className='flex items-center space-x-2 text-sm'>
          <li className='font-semibold text-green-400'>
            {(movie!.vote_average * 10).toFixed(2)}% Match
          </li>
          <li className='font-light'>{movie?.release_date || movie?.first_air_date}</li>
          <li className='flex h-4 items-center justify-center rounded border border-white/40 px-1.5 text-xs'>
            HD
          </li>
        </ul>

        <div className='flex flex-col gap-x-10 gap-y-4 font-light text-lg md:text-xl md:flex-row'>
          <p className='w-5/6'>{movie?.overview}</p>

          <ul className='flex flex-col space-y-3 text-sm'>
            <li>
              <p>
                <span className='text-[gray]'>Genres:</span>{' '}
                {genres.map((genre) => genre.name).join(', ')}
              </p>
            </li>

            <li>
              <p>
                <span className='text-[gray]'>Original language:</span> {movie?.original_language}
              </p>
            </li>

            <li>
              <p>
                <span className='text-[gray]'>Total votes:</span> {movie?.vote_count}
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
});

export default ModalInfo;
