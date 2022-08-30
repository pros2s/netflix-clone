import { deleteDoc, doc, DocumentData, setDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db } from '../firebase';

import { RiCloseCircleLine } from 'react-icons/ri';
import toast from 'react-hot-toast';

import { Movie } from '../types';

export const handleMovieList = async (
  user: User | null,
  isMovieAdded: boolean,
  movie: Movie | DocumentData | null,
  movieCollection: string,
  movieList: string,
) => {
  toast(
    (t) => (
      <div className='flex space-x-3 items-center'>
        <p className='bg-white text-black font-semibold'>
          <span className='font-bold'>{movie?.title || movie?.original_name}</span> has been{' '}
          <span className='underline'>{isMovieAdded ? 'removed' : 'added'}</span>{' '}
          {isMovieAdded ? 'from' : 'to'} your {movieList}
        </p>
        <button onClick={() => toast.dismiss(t.id)}>
          <RiCloseCircleLine className='w-7 h-7 cursor-pointer transition duration-200 hover:rotate-90 hover:scale-125' />
        </button>
      </div>
    ),
    {
      duration: 4000,
      style: {
        borderRadius: '30px',
        boxShadow: 'none',
        minWidth: '400px',
      },
    },
  );

  if (isMovieAdded) {
    await deleteDoc(
      doc(db, 'users', user!.uid, movieCollection, (movie?.title || movie?.original_name)!),
    );
  } else {
    await setDoc(
      doc(db, 'users', user!.uid, movieCollection, (movie?.title || movie?.original_name)!),
      {
        ...movie,
      },
    );

    movieCollection === 'Liked' &&
      (await deleteDoc(
        doc(db, 'users', user!.uid, 'Disliked', (movie?.title || movie?.original_name)!),
      ));

    movieCollection === 'Disliked' &&
      (await deleteDoc(
        doc(db, 'users', user!.uid, 'Liked', (movie?.title || movie?.original_name)!),
      ));
  }
};
