import { useEffect, useState } from 'react';
import { collection, DocumentData, onSnapshot } from 'firebase/firestore';

import { db } from '../firebase';
import { Movie } from '../types';

export const useMovieList = (userId: string | undefined, movieCollection: string) => {
  const [movieList, setMovieList] = useState<DocumentData[] | Movie[]>([]);

  useEffect(() => {
    if (!userId) return;

    return onSnapshot(collection(db, 'users', userId, movieCollection), (snapshot) => {
      setMovieList(
        snapshot.docs.map((movie) => ({
          id: movie.id,
          ...movie.data(),
        })),
      );
    });
  }, [db, userId]);

  return movieList;
};
