import { deleteDoc, doc, DocumentData, setDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db } from '../firebase';

import { RiCloseCircleLine } from 'react-icons/ri';
import toast from 'react-hot-toast';

import { Movie } from '../types';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { profilesSelector } from '../store/slices/profiles';

export const handleMovieList = async (
  user: User | null,
  isMovieAdded: boolean,
  movie: Movie | DocumentData | null,
  movieCollection: string,
  currentProfile: string,
  movieList: string,
) => {
  toast(
    (t) => (
      <div className='flex space-x-3 items-center min-w-[300px] md:min-w-[400px]'>
        <p className='bg-white text-black font-semibold'>
          <span className='font-bold'>{movie?.title || movie?.original_name}</span> has been{' '}
          <span className='underline'>{isMovieAdded ? 'removed' : 'added'}</span>{' '}
          {isMovieAdded ? 'from' : 'to'} your {movieList}
        </p>
        <button onClick={() => toast.dismiss(t.id)}>
          <RiCloseCircleLine className='w-7 h-7 cursor-pointer transition duration-200md:hover:rotate-90md:hover:scale-125' />
        </button>
      </div>
    ),
    {
      duration: 4000,
      style: {
        borderRadius: '8px',
        boxShadow: 'none',
      },
    },
  );

  if (isMovieAdded) {
    await deleteDoc(
      doc(
        db,
        'users',
        user!.uid,
        'profiles',
        currentProfile,
        movieCollection,
        (movie?.title || movie?.original_name)!,
      ),
    );
  } else {
    await setDoc(
      doc(
        db,
        'users',
        user!.uid,
        'profiles',
        currentProfile,
        movieCollection,
        (movie?.title || movie?.original_name)!,
      ),
      {
        ...movie,
      },
    );

    movieCollection === 'Liked' &&
      (await deleteDoc(
        doc(
          db,
          'users',
          user!.uid,
          'profiles',
          currentProfile,
          'Disliked',
          (movie?.title || movie?.original_name)!,
        ),
      ));

    movieCollection === 'Disliked' &&
      (await deleteDoc(
        doc(
          db,
          'users',
          user!.uid,
          'profiles',
          currentProfile,
          'Liked',
          (movie?.title || movie?.original_name)!,
        ),
      ));
  }
};
