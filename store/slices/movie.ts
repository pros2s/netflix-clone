import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DocumentData } from 'firebase/firestore';
import { Movie } from '../../types';
import { RootState } from '../store';

interface IMovieState {
  movie: Movie | DocumentData | null;
}

const initialState: IMovieState = {
  movie: null,
};

const movieSlice = createSlice({
  name: 'movie',
  initialState,
  reducers: {
    setCurrentMovie(state, { payload }: PayloadAction<Movie>) {
      state.movie = payload;
    },
    resetMovie(state) {
      state.movie = null;
    },
  },
});

export const movieSelector = (state: RootState) => state.movie;
export const { resetMovie, setCurrentMovie } = movieSlice.actions;

export default movieSlice.reducer;
