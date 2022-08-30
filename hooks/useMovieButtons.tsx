import { User } from 'firebase/auth';
import { collection, DocumentData, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { Movie } from '../types';

export const useMovieButtons = (user: User | null, movie: Movie | DocumentData | null) => {
  const [isMovieAdded, setIsMovieAdded] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isDisliked, setIsDisliked] = useState<boolean>(false);

  const [myListMovies, setMyListMovies] = useState<DocumentData[] | Movie[]>([]);
  const [likedMovies, setLikedMovies] = useState<DocumentData[] | Movie[]>([]);
  const [dislikedMovies, setDislikedMovies] = useState<DocumentData[] | Movie[]>([]);

  useEffect(() => {
    if (user) {
      onSnapshot(collection(db, 'users', user.uid, 'myList'), (snapshot) =>
        setMyListMovies(snapshot.docs),
      );
      onSnapshot(collection(db, 'users', user.uid, 'Liked'), (snapshot) =>
        setLikedMovies(snapshot.docs),
      );
      onSnapshot(collection(db, 'users', user.uid, 'Disliked'), (snapshot) =>
        setDislikedMovies(snapshot.docs),
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
