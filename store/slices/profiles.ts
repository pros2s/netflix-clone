import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface IProfilesState {
  profiles: string[];
  currentProfile: string;
  choosing: boolean;
}

const initialState: IProfilesState = {
  profiles: [],
  currentProfile: '',
  choosing: false,
};

const profilesSlice = createSlice({
  name: 'profiles',
  initialState,
  reducers: {
    addNewProfile(state, { payload }: PayloadAction<string>) {
      state.profiles = [...state.profiles, payload];
    },
    removeProfile(state, { payload }: PayloadAction<string>) {
      state.profiles = state.profiles.filter((profile) => profile !== payload);
    },
    removeAllProfiles(state) {
      state.profiles = [];
    },
    setCurrentProfile(state, { payload }: PayloadAction<string>) {
      state.currentProfile = payload;
    },
    choosingIcon(state) {
      state.choosing = true;
    },
    choosedIcon(state) {
      state.choosing = false;
    },
  },
});

export const profilesSelector = (state: RootState) => state.profiles;
export const {
  addNewProfile,
  removeProfile,
  choosedIcon,
  choosingIcon,
  removeAllProfiles,
  setCurrentProfile,
} = profilesSlice.actions;

export default profilesSlice.reducer;
