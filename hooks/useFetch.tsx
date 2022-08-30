import { DocumentData } from 'firebase/firestore';
import axios from 'axios';
import { Element, Genre, Movie } from '../types';

export const useFetch = async (movie: Movie | DocumentData | null) => {
  let trailerId: string = '';
  let genresArr: Genre[] = [];

  try {
    const data = await axios.get(
      `https://api.themoviedb.org/3/${movie?.media_type === 'tv' ? 'tv' : 'movie'}/${
        movie?.id
      }?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&append_to_response=videos`,
    );

    const trailerIndex = data.data.videos.results.findIndex(
      (elem: Element) => elem.type === 'Trailer',
    );

    trailerId = data.data.videos?.results[trailerIndex]?.key;
    genresArr = data.data.genres;
  } catch {
    console.log('Error with fetch movie');
  }

  return { genresArr, trailerId };
};
