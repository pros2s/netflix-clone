import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface ISearchState {
  searchValue: string;
}

const initialState: ISearchState = {
  searchValue: '',
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchValue(state, { payload }: PayloadAction<string>) {
      state.searchValue = payload;
    },
  },
});

export const searchSelector = (state: RootState) => state.search;
export const { setSearchValue } = searchSlice.actions;

export default searchSlice.reducer;
