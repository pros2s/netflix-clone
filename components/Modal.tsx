import { FC, useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { Toaster } from 'react-hot-toast';

import { CheckIcon, PlusIcon, VolumeOffIcon, VolumeUpIcon, XIcon } from '@heroicons/react/outline';
import {
  MdOutlineThumbDownOffAlt,
  MdOutlineThumbUpOffAlt,
  MdThumbDownAlt,
  MdThumbUpAlt,
} from 'react-icons/md';
import { FaPlay } from 'react-icons/fa';
import MuiModal from '@mui/material/Modal';

import { useTypedSelector } from '../hooks/useTypedSelector';
import { useTypedDispatch } from '../hooks/useTypedDispatch';
import { useFetch } from '../hooks/useFetch';
import { useMovieButtons } from '../hooks/useMovieButtons';
import useAuth from '../hooks/useAuth';

import { closeModal, modalSelector, toggleMuteVideo } from '../store/slices/modal';
import { movieSelector } from '../store/slices/movie';
import { Genre } from '../types';
import { handleMovieList } from '../utils/toast';

const Modal: FC = () => {
  const dispatch = useTypedDispatch();
  const { isOpenedModal, isMutedVideo } = useTypedSelector(modalSelector);
  const { movie } = useTypedSelector(movieSelector);

  const { user } = useAuth();
  const { isLiked, isDisliked, isMovieAdded } = useMovieButtons(user, movie);

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

  return (
    <MuiModal
      className='fixed left-0 right-0 px-3 z-50 mx-auto w-full max-w-5xl overflow-hidden overflow-y-scroll rounded-2xl scrollbar-hide md:!top-7'
      open={isOpenedModal}
      onClose={() => dispatch(closeModal())}>
      <>
        <Toaster position='bottom-center' />

        <button
          className='modalButton absolute right-5 top-5 !z-40 h-9 w-9 border-0 bg-[#181818] md:hover:rotate-90 md:hover:bg-[#181818] md:hover:border-2'
          onClick={() => dispatch(closeModal())}>
          <XIcon className='h-6 w-6' />
        </button>

        <div className='relative pt-[56.25%]'>
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${trailer}`}
            width='100%'
            height='100%'
            style={{ position: 'absolute', top: '0', left: '0' }}
            playing
            volume={0.25}
            config={{
              youtube: {
                playerVars: { showinfo: 1 },
              },
            }}
            muted={isMutedVideo}
          />

          <div className='absolute bottom-3 md:bottom-10 flex w-full items-center justify-between px-10'>
            <ul className='flex space-x-2'>
              <li>
                <button className='flex items-center gap-x-2 py-1 px-5 rounded bg-white font-bold text-black line-through transition md:py-2 md:px-8 md:text-xl md:hover:bg-[#e6e6e6]'>
                  <FaPlay className='h-5 w-5 text-black md:h-7 md:w-7' />
                  Play
                </button>
              </li>

              <li>
                <button
                  data-text={`${isMovieAdded ? 'Remove from my list' : 'Add to my list'}`}
                  className={`myListModal ${
                    !isMovieAdded
                      ? 'hover:after:w-[150px] md:hover:after:-left-14'
                      : 'hover:after:-left-[82px]'
                  }`}
                  onClick={() => handleMovieList(user, isMovieAdded, movie, 'myList', 'list')}>
                  {isMovieAdded ? (
                    <CheckIcon className='h-7 w-7' />
                  ) : (
                    <PlusIcon className='h-7 w-7' />
                  )}
                </button>
              </li>

              <li>
                <button
                  data-text={`${isLiked ? 'Remove from Liked' : 'Like'}`}
                  className={`likeModal ${!isLiked && 'hover:after:w-20 md:hover:after:-left-4'}`}
                  onClick={() => handleMovieList(user, isLiked, movie, 'Liked', 'liked')}>
                  {isLiked ? (
                    <MdThumbUpAlt className='h-6 w-6 text-white md:hover:text-white/80' />
                  ) : (
                    <MdOutlineThumbUpOffAlt className='h-6 w-6 text-white/80 md:hover:text-white' />
                  )}
                </button>
              </li>

              <li>
                <button
                  data-text={`${isDisliked ? 'Remove from Disliked' : 'Not for me'}`}
                  className={`dislikeModal ${
                    isDisliked
                      ? 'opacity-60 md:hover:after:w-60 md:hover:after:-left-[86px]'
                      : 'hover:after:w-32 md:hover:after:-left-[40px]'
                  }`}
                  onClick={() => handleMovieList(user, isDisliked, movie, 'Disliked', 'disliked')}>
                  {isDisliked ? (
                    <MdThumbDownAlt className='h-6 w-6' />
                  ) : (
                    <MdOutlineThumbDownOffAlt className='h-6 w-6' />
                  )}
                </button>
              </li>
            </ul>

            <button
              data-text={`${isMutedVideo ? 'Unmute' : 'Mute'}`}
              className={`muteModal ${
                isMutedVideo ? 'hover:after:w-24' : 'hover:after:w-18 md:hover:after:-left-[17px]'
              }`}
              onClick={() => dispatch(toggleMuteVideo())}>
              {isMutedVideo ? (
                <VolumeOffIcon className='h-6 w-6' />
              ) : (
                <VolumeUpIcon className='h-6 w-6' />
              )}
            </button>
          </div>
        </div>

        <div className='flex space-x-16 rounded-b-md bg-[#181818] px-10 py-8'>
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
                    <span className='text-[gray]'>Original language:</span>{' '}
                    {movie?.original_language}
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
      </>
    </MuiModal>
  );
};

export default Modal;
