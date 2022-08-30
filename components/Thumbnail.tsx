import { FC, useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { FaPlay } from 'react-icons/fa';
import { Toaster } from 'react-hot-toast';
import { PlusIcon, ThumbUpIcon, InformationCircleIcon, CheckIcon } from '@heroicons/react/outline';

import { collection, DocumentData, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import Image from 'next/image';

import { useTypedDispatch } from '../hooks/useTypedDispatch';
import { useFetch } from '../hooks/useFetch';
import useAuth from '../hooks/useAuth';

import { openModal } from '../store/slices/modal';
import { setCurrentMovie } from '../store/slices/movie';

import { Genre, Movie } from '../types';
import { handleList } from '../utils/toast';

interface ThumbnailProps {
  movie: Movie | DocumentData;
  index: number;
  rowLength: number;
}

const Thumbnail: FC<ThumbnailProps> = ({ movie, index, rowLength }) => {
  const dispatch = useTypedDispatch();
  const { user } = useAuth();

  const [hover, setHover] = useState<boolean>(false);
  const [isPlay, setIsPlay] = useState<boolean>(false);
  const [isMovieAdded, setIsMovieAdded] = useState<boolean>(false);

  const [trailer, setTrailer] = useState<string>('');
  const [genres, setGenres] = useState<Genre[]>([]);
  const [movies, setMovies] = useState<DocumentData[] | Movie[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { genresArr, trailerId } = await useFetch(movie);
      setTrailer(trailerId);
      setGenres(genresArr);
    };

    fetchData();
  }, [movie]);

  useEffect(() => {
    if (user) {
      return onSnapshot(collection(db, 'users', user.uid, 'myList'), (snapshot) =>
        setMovies(snapshot.docs),
      );
    }
  }, [db, movie?.id]);

  useEffect(
    () => setIsMovieAdded(movies.findIndex((elem) => elem.data().id === movie?.id) !== -1),
    [movies],
  );

  let hoverTimeout: ReturnType<typeof setTimeout>;
  const onHover = () => {
    setHover(true);

    if (isPlay) return;

    hoverTimeout = setTimeout(() => {
      setIsPlay(true);
    }, 2000);
  };

  const onLeave = () => {
    setIsPlay(false);
    setHover(false);
    clearTimeout(hoverTimeout);
  };

  return (
    <div
      className={`relative ${index === 0 && 'ml-[60px]'} ${
        index === rowLength - 1 && '!mr-[60px]'
      } -top-12 h-28 min-w-[180px] md:min-w-[260px] md:h-36`}
      onMouseOver={onHover}
      onMouseOut={onLeave}>
      <Toaster position='bottom-center' />

      <div
        className={`relative h-28 min-w-[180px] cursor-pointer transition duration-200 ease-out md:min-w-[260px] md:h-36 md:hover:h-[270px] md:hover:scale-[1.5] md:hover:absolute md:hover:z-[100] md:hover:top-0 `}>
        {hover ? (
          <>
            <div className='relative h-[55%]'>
              {isPlay ? (
                <ReactPlayer
                  url={`https://www.youtube.com/watch?v=${trailer}`}
                  width='100%'
                  height='100%'
                  style={{ position: 'absolute', top: '0', left: '0' }}
                  playing
                  muted={true}
                />
              ) : (
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path || movie.poster_path}`}
                  className='object-cover md:rounded'
                  layout='fill'
                  priority
                  alt={movie?.title || movie?.original_name}
                />
              )}

              <h4 className='absolute max-w-[80px] bottom-2 left-2 leading-[1] text-shadow-xl font-medium'>
                {movie?.title || movie?.original_name}
              </h4>
            </div>

            <div className='relative bg-[#242424] h-[45%]'>
              <div className='pl-3'>
                <div className='absolute h-[20%] top-1.5 flex w-full items-center justify-between'>
                  <ul className='flex gap-x-1'>
                    <li>
                      <button className='flex items-center h-6 w-6 p-[6px] rounded-full bg-white text-xl font-bold text-black transition hover:bg-[#e6e6e6]'>
                        <FaPlay className='text-black' />
                      </button>
                    </li>

                    <li>
                      <button
                        className='modalButton h-6 w-6 border-[1px] p-[2.5px]'
                        onClick={() => handleList(user, isMovieAdded, movie)}>
                        {isMovieAdded ? <CheckIcon /> : <PlusIcon />}
                      </button>
                    </li>

                    <li>
                      <button className='modalButton h-6 w-6 border-[1px] p-[3px]'>
                        <ThumbUpIcon />
                      </button>
                    </li>
                  </ul>

                  <button
                    className='h-8 w-8 p-1 mr-4 opacity-70 hover:opacity-100'
                    onClick={() => {
                      dispatch(openModal());
                      movie && dispatch(setCurrentMovie(movie));
                    }}>
                    <InformationCircleIcon />
                  </button>
                </div>

                <ul className='absolute top-9 flex items-center space-x-2 text-[10px]'>
                  <li className='font-semibold text-green-400'>
                    {(movie!.vote_average * 10).toFixed(2)}% Match
                  </li>

                  <li className='font-light text-[#ebebeb]'>
                    {movie?.release_date || movie?.first_air_date}
                  </li>

                  <li className='flex h-3 items-center justify-center rounded border border-white/40 px-1.5 leading-3 text-[8px] font-light'>
                    HD
                  </li>
                </ul>

                <ul className='absolute top-[49px] flex items-center text-[9px] text-[#c5c5c5] font-extralight'>
                  {genres.map((genre, i) => (
                    <li className='mr-1.5'>
                      {genre.name}
                      {i !== genres.length - 1 && <span className='ml-1.5'>•</span>}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        ) : (
          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path || movie.poster_path}`}
            className='object-cover md:rounded'
            layout='fill'
            priority
            alt={movie?.title || movie?.original_name}
          />
        )}
      </div>
    </div>
  );
};

export default Thumbnail;
