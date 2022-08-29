import { FC, useEffect, useState } from 'react';
import { collection, deleteDoc, doc, DocumentData, onSnapshot, setDoc } from 'firebase/firestore';
import ReactPlayer from 'react-player';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

import { RiCloseCircleLine } from 'react-icons/ri';
import { FaPlay } from 'react-icons/fa';

import { useTypedSelector } from '../hooks/useTypedSelector';
import { useTypedDispatch } from '../hooks/useTypedDispatch';

import { closeModal, modalSelector, toggleMuteVideo } from '../store/slices/modal';
import { movieSelector } from '../store/slices/movie';
import { Element, Genre, Movie } from '../types';
import { db } from '../firebase';
import useAuth from '../hooks/useAuth';

import MuiModal from '@mui/material/Modal';
import {
  CheckIcon,
  PlusIcon,
  ThumbUpIcon,
  VolumeOffIcon,
  VolumeUpIcon,
  XIcon,
} from '@heroicons/react/outline';

const Modal: FC = () => {
  const dispatch = useTypedDispatch();
  const { isOpenedModal, isMutedVideo } = useTypedSelector(modalSelector);
  const { movie } = useTypedSelector(movieSelector);
  const { user } = useAuth();

  const [trailer, setTrailer] = useState<string>('');
  const [isMovieAdded, setIsMovieAdded] = useState<boolean>(false);
  const [movies, setMovies] = useState<DocumentData[] | Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await axios.get(
          `https://api.themoviedb.org/3/${movie?.media_type === 'tv' ? 'tv' : 'movie'}/${
            movie?.id
          }?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&append_to_response=videos`,
        );

        if (data.data.videos) {
          const trailerIndex = data.data.videos.results.findIndex(
            (elem: Element) => elem.type === 'Trailer',
          );
          setTrailer(data.data.videos?.results[trailerIndex]?.key);
        }

        data.data.genres && setGenres(data.data.genres);
      } catch {
        console.log('Error with fetch movie');
      }
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

  const handleList = async () => {
    if (isMovieAdded) {
      await deleteDoc(
        doc(db, 'users', user!.uid, 'myList', (movie?.title || movie?.original_name)!),
      );
    } else {
      await setDoc(doc(db, 'users', user!.uid, 'myList', (movie?.title || movie?.original_name)!), {
        ...movie,
      });
    }

    toast(
      (t) => (
        <div className='flex space-x-3 items-center'>
          <p className='bg-white text-black font-semibold'>
            <span className='font-bold'>{movie?.title || movie?.original_name}</span> has been{' '}
            <span className='underline'>{isMovieAdded ? 'removed' : 'added'}</span>{' '}
            {isMovieAdded ? 'from' : 'to'} your list
          </p>
          <button onClick={() => toast.dismiss(t.id)}>
            <RiCloseCircleLine className='w-7 h-7 cursor-pointer transition duration-200 hover:rotate-90 hover:scale-125' />
          </button>
        </div>
      ),
      {
        duration: 2000,
        style: {
          borderRadius: '30px',
          minWidth: isMovieAdded ? '480px' : '450px',
        },
      },
    );
  };

  return (
    <MuiModal
      className='fixed !top-7 left-0 right-0 z-50 mx-auto w-full max-w-5xl overflow-hidden overflow-y-scroll rounded-md scrollbar-hide'
      open={isOpenedModal}
      onClose={() => dispatch(closeModal())}>
      <>
        <Toaster position='bottom-center' />
        <button
          className='modalButton absolute right-5 top-5 !z-40 h-9 w-9 border-none bg-[#181818] hover:bg-[#181818]'
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
          <div className='absolute bottom-10 flex w-full items-center justify-between px-10'>
            <div className='flex space-x-2'>
              <button className='flex items-center gap-x-2 rounded bg-white px-8 text-xl font-bold text-black transition hover:bg-[#e6e6e6]'>
                <FaPlay className='h-7 w-7 text-black' />
                Play
              </button>
              <button className='modalButton' onClick={handleList}>
                {isMovieAdded ? (
                  <CheckIcon className='h-7 w-7' />
                ) : (
                  <PlusIcon className='h-7 w-7' />
                )}
              </button>
              <button className='modalButton'>
                <ThumbUpIcon className='h-6 w-6' />
              </button>
            </div>
            <button className='modalButton' onClick={() => dispatch(toggleMuteVideo())}>
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
            <div className='flex items-center space-x-2 text-sm'>
              <p className='font-semibold text-green-400'>{movie!.vote_average * 10}% Match</p>
              <p className='font-light'>{movie?.release_date || movie?.first_air_date}</p>
              <div className='flex h-4 items-center justify-center rounded border border-white/40 px-1.5 text-xs'>
                HD
              </div>
            </div>
            <div className='flex flex-col gap-x-10 gap-y-4 font-light md:flex-row'>
              <p className='w-5/6'>{movie?.overview}</p>
              <div className='flex flex-col space-y-3 text-sm'>
                <div>
                  <span className='text-[gray]'>Genres:</span>{' '}
                  {genres.map((genre) => genre.name).join(', ')}
                </div>

                <div>
                  <span className='text-[gray]'>Original language:</span> {movie?.original_language}
                </div>

                <div>
                  <span className='text-[gray]'>Total votes:</span> {movie?.vote_count}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </MuiModal>
  );
};

export default Modal;
