import { useEffect, useState } from 'react';
import { collection, DocumentData, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

import { useTypedSelector } from './useTypedSelector';
import { profilesSelector } from '../store/slices/profiles';
import { Movie } from '../types';

export const useMovieList = (userId: string | undefined, movieCollection: string) => {
  const [movieList, setMovieList] = useState<DocumentData[] | Movie[]>([]);
  const { currentProfile } = useTypedSelector(profilesSelector);

  useEffect(() => {
    if (!userId) return;

    return onSnapshot(
      collection(db, 'users', userId, 'profiles', currentProfile, movieCollection),
      (snapshot) => {
        setMovieList(
          snapshot.docs.map((movie) => ({
            id: movie.id,
            ...movie.data(),
          })),
        );
      },
    );
  }, [db, userId, currentProfile]);

  return movieList;
};
