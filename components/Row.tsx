import { FC, memo, useCallback, useEffect, useRef, useState } from 'react';
import { DocumentData } from 'firebase/firestore';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';
import Fuse from 'fuse.js';
import { v4 } from 'uuid';

import Thumbnail from './thumbnail/Thumbnail';

import { useTypedSelector } from '../hooks/useTypedSelector';
import { Genre, Movie } from '../types';
import { searchSelector } from '../store/slices/search';
import { useFetch } from '../hooks/useFetch';

interface RowProps {
  title: string;
  movies: DocumentData[] | Movie[];
}

const Row: FC<RowProps> = memo(({ movies, title }) => {
  const { searchValue } = useTypedSelector(searchSelector);

  const rowRef = useRef<HTMLDivElement>(null);
  const [isMoved, setIsMoved] = useState<boolean>(false);
  const [displayMovies, setDisplayMovies] = useState<DocumentData[] | Movie[]>([]);

  useEffect(() => {
    setDisplayMovies(movies);
  }, [movies]);
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    const fetchGenres = async () => {
      const { genresArr } = await useFetch(movies[0]);
      setGenres(genresArr);
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    const isByGenre = searchValue.toLocaleLowerCase().startsWith('genre ');

    let finalMovies = movies;

    if (searchValue) {
      if (isByGenre) {
        const fuseGenre = new Fuse(genres, { keys: ['name'] });

        const searchedGenres = fuseGenre.search(searchValue.slice(6, -1)).map((res) => res.item);
        const moviesByGenre = movies.filter((movie) =>
          movie.genre_ids.some((id: number) => searchedGenres.some((genre) => id === genre.id))
        );

        finalMovies = moviesByGenre;
      } else {
        const fuse = new Fuse(movies, {
          keys: ['title', 'overview', 'popularity'],
        });

        const searchedMovies = fuse.search(searchValue).map((res) => res.item);
        finalMovies = searchedMovies;
      }
    }

    setDisplayMovies(finalMovies);
  }, [searchValue]);

  const handleClick = useCallback(
    (direction: string) => {
      setIsMoved(true);

      const { scrollLeft, clientWidth } = rowRef.current!;

      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;

      rowRef.current?.scrollTo({ left: scrollTo, behavior: 'smooth' });
    },
    [isMoved]
  );

  return (
    <>
      {displayMovies.length > 0 && (
        <div className='relative h-44 md:h-24 md:space-y-2'>
          <h2 className='font-semibold text-lg mb-2 cursor-pointer transition duration-200 md:text-2xl md:absolute md:top-0 md:w-56'>
            {title}
          </h2>

          <div className='group relative'>
            <button
              className={`chevronButton -left-16  md:hover:bg-gradient-to-r from-gray-900 ${
                !isMoved && 'hidden'
              }`}
              onClick={() => handleClick('left')}
            >
              <ChevronLeftIcon />
            </button>

            <div
              ref={rowRef}
              className='flex overflow-y-hidden items-center space-x-0.5 overflow-x-scroll scrollbar-hide md:h-80 md:-mx-[60px]'
            >
              {displayMovies.map((movie, i) => (
                <Thumbnail key={v4()} movie={movie} index={i} rowLength={displayMovies.length} />
              ))}
            </div>

            <button
              className={`chevronButton -right-16  md:hover:bg-gradient-to-l from-gray-900`}
              onClick={() => handleClick('right')}
            >
              <ChevronRightIcon />
            </button>
          </div>
        </div>
      )}
    </>
  );
});

export default Row;
