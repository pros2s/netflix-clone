import { memo } from 'react';

import { FaPlay } from 'react-icons/fa';
import { InformationCircleIcon } from '@heroicons/react/solid';

import { useTypedDispatch } from '../../hooks/useTypedDispatch';
import { openModal } from '../../store/slices/modal';
import { setCurrentMovie } from '../../store/slices/movie';
import { profilesSelector } from '../../store/slices/profiles';

import { MovieProp } from '../../types';
import { handleMovieList } from '../../utils/toast';
import useAuth from '../../hooks/useAuth';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { moviesHistorySelector, setLastMovie } from '../../store/slices/moviesHistory';

const BannerBTNs = memo(({ movie }: MovieProp) => {
  const dispatch = useTypedDispatch();
  const { currentProfile } = useTypedSelector(profilesSelector);
  const { user } = useAuth();
  const { firstMovie, lastMovies } = useTypedSelector(moviesHistorySelector);

  return (
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
          dispatch(setLastMovie(movie));
          handleMovieList(user, false, movie, 'last-viewed', currentProfile, 'Last viewed list');

          if (!!firstMovie) {
            handleMovieList(
              user,
              true,
              firstMovie,
              'last-viewed',
              currentProfile,
              'Last viewed list'
            );
          }
        }}
      >
        <p className='defaultText'>More Info</p>{' '}
        <InformationCircleIcon className='h-5 w-5 md:h-8 md:w-8' />
      </button>
    </div>
  );
});

export default BannerBTNs;
