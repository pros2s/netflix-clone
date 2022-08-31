import { FC, useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { FaPlay } from 'react-icons/fa';
import {
  MdOutlineThumbDownOffAlt,
  MdOutlineThumbUpOffAlt,
  MdThumbDownAlt,
  MdThumbUpAlt,
} from 'react-icons/md';
import { Toaster } from 'react-hot-toast';
import {
  PlusIcon,
  InformationCircleIcon,
  CheckIcon,
  ChevronLeftIcon,
  VolumeOffIcon,
  VolumeUpIcon,
} from '@heroicons/react/outline';

import { DocumentData } from 'firebase/firestore';
import Image from 'next/image';

import { useTypedDispatch } from '../hooks/useTypedDispatch';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { useFetch } from '../hooks/useFetch';
import useAuth from '../hooks/useAuth';

import { modalSelector, openModal, toggleMuteVideo } from '../store/slices/modal';
import { setCurrentMovie } from '../store/slices/movie';

import { Genre, Movie } from '../types';
import { handleMovieList } from '../utils/toast';
import { useMovieButtons } from '../hooks/useMovieButtons';

interface ThumbnailProps {
  movie: Movie | DocumentData;
  index: number;
  rowLength: number;
}

const Thumbnail: FC<ThumbnailProps> = ({ movie, index, rowLength }) => {
  const dispatch = useTypedDispatch();
  const { isMutedVideo } = useTypedSelector(modalSelector);
  const { user } = useAuth();
  const { isDisliked, isLiked, isMovieAdded } = useMovieButtons(user, movie);

  const [hover, setHover] = useState<boolean>(false);
  const [isPlay, setIsPlay] = useState<boolean>(false);
  const [isShowInfo, setIsShowInfo] = useState<boolean>(false);

  const [trailer, setTrailer] = useState<string>('');
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { genresArr, trailerId } = await useFetch(movie);
      setTrailer(trailerId);
      setGenres(genresArr);
    };

    fetchData();
  }, [movie]);

  let isPlayTimeout: ReturnType<typeof setTimeout>;
  const onHover = () => {
    !hover && window.innerWidth > 1023 && setHover(true);

    if (isPlay) return;

    if (hover) {
      isPlayTimeout = setTimeout(() => {
        setIsPlay(true);
      }, 2000);
    }
  };

  const onLeave = () => {
    clearTimeout(isPlayTimeout);
    setHover(false);
    setIsPlay(false);
    setIsShowInfo(false);
  };

  const handleModal = () => {
    dispatch(openModal());
    movie && dispatch(setCurrentMovie(movie));
  };

  return (
    <div
      className={`relative ${index === 0 && 'md:ml-[60px]'} ${
        index === rowLength - 1 && 'md:!mr-[60px]'
      } h-28 min-w-[180px] md:cursor-pointer md:min-w-[260px] md:h-36 md:-top-12`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}>
      <Toaster position='bottom-center' />
      {hover ? (
        <div
          className={`relative h-28 min-w-[180px] cursor-pointer transition duration-300 ease-out md:min-w-[260px] md:h-36  md:hover:h-[270px]  md:hover:scale-[1.5]  md:hover:absolute  md:hover:z-[100]`}>
          <div className='relative h-[55%]'>
            {isPlay ? (
              <ReactPlayer
                url={`https://www.youtube.com/watch?v=${trailer}`}
                width='100%'
                height='100%'
                style={{ position: 'absolute', top: '0', left: '0' }}
                volume={0.25}
                playing
                muted={isMutedVideo}
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

            <button
              data-text={`${isMutedVideo ? 'Unmute' : 'Mute'}`}
              className={`muteButton ${
                isMutedVideo ? 'hover:after:-left-7' : 'hover:after:-left-5'
              }`}
              onClick={() => dispatch(toggleMuteVideo())}>
              {isMutedVideo ? (
                <VolumeOffIcon className='h-4 w-4' />
              ) : (
                <VolumeUpIcon className='h-4 w-4' />
              )}
            </button>
          </div>

          <div className={`relative bg-[#242424] ${!isShowInfo ? 'h-[19%]' : 'h-[45%]'}`}>
            <div className='pl-3'>
              <div
                className={`absolute ${
                  isShowInfo ? 'h-[20%]' : 'h-[48%]'
                } top-1.5 flex w-full items-center justify-between`}>
                <ul className='flex gap-x-2'>
                  <li>
                    <button
                      data-text='Play'
                      className={`playButton ${index === 0 && 'hover:after:-left-2'}`}>
                      <FaPlay className='text-black pl-0.5 h-4 w-4' />
                    </button>
                  </li>

                  <li>
                    <button
                      data-text={`${isMovieAdded ? 'Remove from my list' : 'Add to my list'}`}
                      className={`modalButton myListButton ${
                        isMovieAdded
                          ? `hover:after:w-[152px] ${index === 0 && 'hover:after:-left-10'}`
                          : `hover:after:w-32  ${
                              index === 0 ? 'hover:after:-left-10' : 'hover:after:-left-12'
                            }`
                      }`}
                      onClick={() => handleMovieList(user, isMovieAdded, movie, 'myList', 'list')}>
                      {isMovieAdded ? <CheckIcon /> : <PlusIcon />}
                    </button>
                  </li>

                  <li>
                    <button
                      data-text={`${isLiked ? 'Remove from Liked' : 'Like'}`}
                      className={`modalButton likeButton ${
                        isLiked && 'hover:after:w-40 md:hover:after:-left-16'
                      } ${isShowInfo && !isLiked && 'scale-110 border-white/80'} ${
                        isLiked && 'border-white'
                      }`}
                      onClick={() => handleMovieList(user, isLiked, movie, 'Liked', 'liked')}>
                      {isLiked ? (
                        <MdThumbUpAlt className='text-white md:hover:text-white/80' />
                      ) : (
                        <>
                          {isShowInfo ? (
                            <MdThumbUpAlt className='text-white/80 md:hover:text-white' />
                          ) : (
                            <MdOutlineThumbUpOffAlt className='text-white/80 md:hover:text-white' />
                          )}
                        </>
                      )}
                    </button>
                  </li>

                  <li>
                    <button
                      data-text={`${isDisliked ? 'Remove from Disliked' : 'Not for me'}`}
                      className={`modalButton disLikeButton ${
                        isDisliked && 'opacity-60 md:hover:after:w-44 md:hover:after:-left-[70px]'
                      }`}
                      onClick={() =>
                        handleMovieList(user, isDisliked, movie, 'Disliked', 'disliked')
                      }>
                      {isDisliked ? <MdThumbDownAlt /> : <MdOutlineThumbDownOffAlt />}
                    </button>
                  </li>
                </ul>

                <div className='flex items-center justify-center mr-5'>
                  <button data-text='More info' className='moreInfoButton' onClick={handleModal}>
                    <InformationCircleIcon />
                  </button>

                  <button
                    data-text={`${
                      isShowInfo ? 'Hide release date & genres' : 'Show release date & genres'
                    }`}
                    className='dropDownButton'
                    onClick={() => setIsShowInfo((state) => !state)}>
                    <ChevronLeftIcon
                      className={`transition duration-200 ${
                        isShowInfo ? 'rotate-90' : '-rotate-90'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <ul className='absolute top-9 flex items-center space-x-2 text-[10px]'>
                {isShowInfo && (
                  <li className='font-semibold text-green-400 transition duration-300'>
                    {(movie!.vote_average * 10).toFixed(2)}% Match
                  </li>
                )}

                {isShowInfo && (
                  <li className='font-light text-[#ebebeb] transition duration-300'>
                    {movie?.release_date || movie?.first_air_date}
                  </li>
                )}

                <li className='flex h-3 items-center justify-center rounded border border-white/40 px-1.5 leading-3 text-[9px] font-light'>
                  HD
                </li>

                {!isPlay && (
                  <p className='leading-3 text-white/70 text-[9px] font-light'>
                    keep md:hovering to play
                  </p>
                )}
              </ul>

              {isShowInfo && (
                <ul className='absolute top-[50px] flex items-center text-[9px] text-[#c5c5c5] font-extralight transition duration-300'>
                  {genres.map((genre, i) => (
                    <li key={genre.id} className='mr-1.5'>
                      {genre.name}
                      {i !== genres.length - 1 && <span className='ml-1.5'>•</span>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      ) : (
        <Image
          src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path || movie.poster_path}`}
          className='object-cover md:rounded'
          layout='fill'
          priority
          alt={movie?.title || movie?.original_name}
          onClick={handleModal}
        />
      )}
    </div>
  );
};

export default Thumbnail;
