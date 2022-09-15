import { memo } from 'react';
import { FaPlay } from 'react-icons/fa';
import { CheckIcon, PlusIcon, VolumeOffIcon, VolumeUpIcon } from '@heroicons/react/outline';
import {
  MdOutlineThumbDownOffAlt,
  MdOutlineThumbUpOffAlt,
  MdThumbDownAlt,
  MdThumbUpAlt,
} from 'react-icons/md';

import { useMovieButtons } from '../../../hooks/useMovieButtons';
import { useTypedDispatch } from '../../../hooks/useTypedDispatch';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import useAuth from '../../../hooks/useAuth';

import { profilesSelector } from '../../../store/slices/profiles';
import { modalSelector, toggleMuteVideo } from '../../../store/slices/modal';

import { handleMovieList } from '../../../utils/toast';
import { MovieProp } from '../../../types';

const ModalBTNs = memo(({ movie }: MovieProp) => {
  const dispatch = useTypedDispatch();
  const { isMutedVideo } = useTypedSelector(modalSelector);
  const { currentProfile } = useTypedSelector(profilesSelector);

  const { user } = useAuth();
  const { isLiked, isDisliked, isMovieAdded } = useMovieButtons(user, movie);

  return (
    <div className='absolute bottom-3 md:bottom-10 flex w-full items-center justify-between px-4 md:px-10'>
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
                ? 'hover:after:w-[160px] md:hover:after:-left-14'
                : 'hover:after:-left-[82px]'
            }`}
            onClick={() =>
              handleMovieList(user, isMovieAdded, movie, 'myList', currentProfile, 'list')
            }
          >
            {isMovieAdded ? <CheckIcon className='h-7 w-7' /> : <PlusIcon className='h-7 w-7' />}
          </button>
        </li>

        <li>
          <button
            data-text={`${isLiked ? 'Remove from Liked' : 'Like'}`}
            className={`likeModal ${!isLiked && 'hover:after:w-20 md:hover:after:-left-4'}`}
            onClick={() => handleMovieList(user, isLiked, movie, 'Liked', currentProfile, 'liked')}
          >
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
            onClick={() =>
              handleMovieList(user, isDisliked, movie, 'Disliked', currentProfile, 'disliked')
            }
          >
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
        onClick={() => dispatch(toggleMuteVideo())}
      >
        {isMutedVideo ? (
          <VolumeOffIcon className='h-6 w-6' />
        ) : (
          <VolumeUpIcon className='h-6 w-6' />
        )}
      </button>
    </div>
  );
});

export default ModalBTNs;
