import { useEffect, useState } from 'react';
import { collection, DocumentData, onSnapshot } from 'firebase/firestore';

import { db } from '../firebase';
import { Movie } from '../types';

export const useMyList = (userId: string | undefined) => {
  const [myList, setMyList] = useState<DocumentData[] | Movie[]>([]);

  useEffect(() => {
    if (!userId) return;

    return onSnapshot(collection(db, 'users', userId, 'myList'), (snapshot) => {
      setMyList(
        snapshot.docs.map((movie) => ({
          id: movie.id,
          ...movie.data(),
        })),
      );
    });
  }, [db, userId]);

  return myList;
};
