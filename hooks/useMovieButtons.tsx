import { useEffect, useState } from 'react';

import { User } from 'firebase/auth';
import { collection, DocumentData, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

import { useTypedSelector } from './useTypedSelector';
import { profilesSelector } from '../store/slices/profiles';
import { Movie } from '../types';

export const useMovieButtons = (user: User | null, movie: Movie | DocumentData | null) => {
  const { currentProfile } = useTypedSelector(profilesSelector);

  const [isMovieAdded, setIsMovieAdded] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isDisliked, setIsDisliked] = useState<boolean>(false);

  const [myListMovies, setMyListMovies] = useState<DocumentData[] | Movie[]>([]);
  const [likedMovies, setLikedMovies] = useState<DocumentData[] | Movie[]>([]);
  const [dislikedMovies, setDislikedMovies] = useState<DocumentData[] | Movie[]>([]);

  useEffect(() => {
    if (user) {
      onSnapshot(
        collection(db, 'users', user.uid, 'profiles', currentProfile, 'myList'),
        (snapshot) => setMyListMovies(snapshot.docs),
      );
      onSnapshot(
        collection(db, 'users', user.uid, 'profiles', currentProfile, 'Liked'),
        (snapshot) => setLikedMovies(snapshot.docs),
      );
      onSnapshot(
        collection(db, 'users', user.uid, 'profiles', currentProfile, 'Disliked'),
        (snapshot) => setDislikedMovies(snapshot.docs),
      );
    }
  }, [db, movie?.id]);

  useEffect(
    () => setIsMovieAdded(myListMovies.findIndex((elem) => elem.data().id === movie?.id) !== -1),
    [myListMovies],
  );

  useEffect(
    () => setIsLiked(likedMovies.findIndex((elem) => elem.data().id === movie?.id) !== -1),
    [likedMovies],
  );

  useEffect(
    () => setIsDisliked(dislikedMovies.findIndex((elem) => elem.data().id === movie?.id) !== -1),
    [dislikedMovies],
  );

  return {
    isMovieAdded,
    isDisliked,
    isLiked,
    myListMovies,
    likedMovies,
    dislikedMovies,
  };
};
