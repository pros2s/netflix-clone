import { FC } from 'react';
import { FaPlay } from 'react-icons/fa';
import {
  MdOutlineThumbDownOffAlt,
  MdOutlineThumbUpOffAlt,
  MdThumbDownAlt,
  MdThumbUpAlt,
} from 'react-icons/md';
import { PlusIcon, CheckIcon } from '@heroicons/react/outline';

import { DocumentData } from 'firebase/firestore';

import useAuth from '../../hooks/useAuth';
import { useMovieButtons } from '../../hooks/useMovieButtons';
import { useTypedSelector } from '../../hooks/useTypedSelector';

import { profilesSelector } from '../../store/slices/profiles';

import { handleMovieList } from '../../utils/toast';
import { Movie } from '../../types';

interface LeftBTNsProps {
  movie: Movie | DocumentData | null;
  index: number | undefined;
  isShowInfo: boolean;
}

const LeftBTNs: FC<LeftBTNsProps> = ({ movie, index, isShowInfo }) => {
  const { currentProfile } = useTypedSelector(profilesSelector);
  const { user } = useAuth();
  const { isDisliked, isLiked, isMovieAdded } = useMovieButtons(user, movie);

  return (
    <ul className='flex space-x-2'>
      <li>
        <button data-text='Play' className={`playButton ${index === 0 && 'hover:after:-left-2'}`}>
          <FaPlay className='text-black pl-0.5 h-4 w-4' />
        </button>
      </li>

      <li>
        <button
          data-text={`${isMovieAdded ? 'Remove from my list' : 'Add to my list'}`}
          className={`modalButton myListButton ${
            isMovieAdded
              ? `hover:after:w-44 ${index === 0 && 'hover:after:-left-10'}`
              : `hover:after:w-32  ${index === 0 ? 'hover:after:-left-10' : 'hover:after:-left-12'}`
          }`}
          onClick={() =>
            handleMovieList(user, isMovieAdded, movie, 'myList', currentProfile, 'list')
          }
        >
          {isMovieAdded ? <CheckIcon /> : <PlusIcon />}
        </button>
      </li>

      <li>
        <button
          data-text={`${isLiked ? 'Remove from Liked' : 'Like'}`}
          className={`modalButton likeButton ${
            isLiked && 'hover:after:w-40 md:hover:after:-left-16'
          } ${isShowInfo && !isLiked && 'scale-110 border-white/80'} ${isLiked && 'border-white'}`}
          onClick={() => handleMovieList(user, isLiked, movie, 'Liked', currentProfile, 'liked')}
        >
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
            handleMovieList(user, isDisliked, movie, 'Disliked', currentProfile, 'disliked')
          }
        >
          {isDisliked ? <MdThumbDownAlt /> : <MdOutlineThumbDownOffAlt />}
        </button>
      </li>
    </ul>
  );
};

export default LeftBTNs;
