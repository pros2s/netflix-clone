import { FC, memo, useCallback, useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { Toaster } from 'react-hot-toast';
import { VolumeOffIcon, VolumeUpIcon } from '@heroicons/react/outline';

import { DocumentData } from 'firebase/firestore';
import Image from 'next/image';

import { useTypedDispatch } from '../../hooks/useTypedDispatch';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useFetch } from '../../hooks/useFetch';

import { modalSelector, openModal, toggleMuteVideo } from '../../store/slices/modal';
import { setCurrentMovie } from '../../store/slices/movie';

import { Genre, Movie } from '../../types';
import LeftBTNs from './LeftBTNs';
import RightBTNs from './RightBTNs';
import Info from './Info';
import { moviesHistorySelector, setLastMovie } from '../../store/slices/moviesHistory';
import { handleMovieList } from '../../utils/toast';
import { profilesSelector } from '../../store/slices/profiles';
import useAuth from '../../hooks/useAuth';

interface ThumbnailProps {
  movie: Movie | DocumentData;
  index?: number;
  rowLength?: number;
}

const Thumbnail: FC<ThumbnailProps> = memo(({ movie, index, rowLength }) => {
  const dispatch = useTypedDispatch();
  const { isMutedVideo } = useTypedSelector(modalSelector);

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

  const onHover = useCallback(() => {
    !hover && window.innerWidth > 1023 && setHover(true);

    if (isPlay) return;

    if (hover) {
      isPlayTimeout = setTimeout(() => {
        setIsPlay(true);
      }, 2000);
    }
  }, [hover]);

  useEffect(() => () => clearTimeout(isPlayTimeout), []);

  const onLeave = useCallback(() => {
    clearTimeout(isPlayTimeout);
    setHover(false);
    setIsPlay(false);
    setIsShowInfo(false);
  }, [hover]);

  const { currentProfile } = useTypedSelector(profilesSelector);
  const { user } = useAuth();
  const { firstMovie } = useTypedSelector(moviesHistorySelector);

  const handleModal = () => {
    dispatch(openModal());
    movie && dispatch(setCurrentMovie(movie));
    dispatch(setLastMovie(movie));
    handleMovieList(user, false, movie, 'last-viewed', currentProfile, 'Last viewed list');

    if (!!firstMovie) {
      handleMovieList(user, true, firstMovie, 'last-viewed', currentProfile, 'Last viewed list');
    }
  };

  return (
    <div
      className={`relative ${index === 0 && 'md:ml-[60px]'} ${
        index === rowLength! - 1 && 'md:!mr-20'
      } h-28 min-w-[180px] md:cursor-pointer md:min-w-[260px] md:h-36 md:-top-12`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <Toaster position='bottom-center' />
      {hover ? (
        <div
          className={`relative min-w-[180px] cursor-pointer transition duration-300 ease-out  md:min-w-[260px] md:h-36 md:hover:h-52 md:hover:scale-[1.5] md:hover:absolute md:hover:z-[100]`}
        >
          <div className={`relative h-[70%]`}>
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

            <h4 className='absolute bottom-2 left-2 max-w-[80px] leading-[1] text-shadow-xl font-medium text-sm'>
              {movie?.title || movie?.original_name}
            </h4>

            <button
              data-text={`${isMutedVideo ? 'Unmute' : 'Mute'}`}
              className={`muteButton ${index === rowLength! - 1 && 'md:hover:after:-left-9'} ${
                isMutedVideo ? 'hover:after:-left-7' : 'hover:after:-left-5'
              }`}
              onClick={() => dispatch(toggleMuteVideo())}
            >
              {isMutedVideo ? (
                <VolumeOffIcon className='h-4 w-4' />
              ) : (
                <VolumeUpIcon className='h-4 w-4' />
              )}
            </button>
          </div>

          <div className={`relative bg-[#242424] ${!isShowInfo ? 'h-[25%]' : 'h-[30%]'}`}>
            <div className='pl-3 w-full'>
              <div
                className={`absolute ${
                  isShowInfo ? 'h-[34%]' : 'h-[41%]'
                } top-1.5 flex w-full items-center justify-between`}
              >
                <div className='flex items-center justify-center mr-5'>
                  <LeftBTNs index={index} isShowInfo={isShowInfo} movie={movie} />

                  <RightBTNs
                    handleModal={handleModal}
                    index={index}
                    isShowInfo={isShowInfo}
                    rowLength={rowLength}
                    setIsShowInfo={setIsShowInfo}
                  />
                </div>
              </div>

              <Info isPlay={isPlay} isShowInfo={isShowInfo} movie={movie} />

              {isShowInfo && (
                <ul className='absolute top-[48px] w-[93%] overflow-hidden whitespace-nowrap text-ellipsis flex items-center text-[9px] text-[#c5c5c5] font-extralight transition duration-300'>
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
        <div className='relative w-full h-full'>
          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path || movie.poster_path}`}
            className='object-cover md:rounded'
            layout='fill'
            priority
            alt={movie?.title || movie?.original_name}
            onClick={handleModal}
          />

          <div className='absolute w-full bottom-0 left-0 py-1 px-3 bg-gradient-to-t from-[#141414]/70'>
            <h4 className='leading-[1] text-shadow-xl font-medium text-sm md:text-lg'>
              {movie?.title || movie?.original_name}
            </h4>
          </div>
        </div>
      )}
    </div>
  );
});

export default Thumbnail;
