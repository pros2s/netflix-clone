import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DocumentData } from 'firebase/firestore';
import { Movie } from '../../types';
import { RootState } from '../store';

interface IMoviesHistoryState {
  lastMovies: Movie[] | DocumentData[];
  firstMovie: Movie | DocumentData | null;
}

const initialState: IMoviesHistoryState = {
  lastMovies: [],
  firstMovie: null,
};

const moviesHistorySlice = createSlice({
  name: 'moviesHistory',
  initialState,
  reducers: {
    initMovies(state, { payload }: PayloadAction<Movie[] | DocumentData[]>) {
      state.lastMovies = payload;
    },
    setLastMovie(state, { payload }: PayloadAction<Movie | DocumentData>) {
      state.lastMovies = state.lastMovies.filter((movie) => movie !== payload);

      state.lastMovies = [...state.lastMovies, payload];

      if (state.lastMovies?.length > 10) {
        state.firstMovie = state.lastMovies.shift()!;
      }
    },
  },
});

export const moviesHistorySelector = (state: RootState) => state.moviesHistory;
export const { setLastMovie, initMovies } = moviesHistorySlice.actions;

export default moviesHistorySlice.reducer;
