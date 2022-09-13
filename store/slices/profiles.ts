import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DocumentData } from 'firebase/firestore';
import { Profile } from '../../types';
import { RootState } from '../store';

interface IProfilesState {
  currentProfile: string;
  isChoosing: boolean;
  profileIcon: string;
  managingProfile: DocumentData | Profile;
  isManagingProfile: boolean;
  managingIcon: string;
  isAddingProfile: boolean;
  isWhoIsWatching: boolean;
}

const initialState: IProfilesState = {
  currentProfile: '',
  isChoosing: false,
  profileIcon: '',
  managingProfile: {
    name: '',
    profileIcon: '',
  },
  isManagingProfile: false,
  managingIcon: '',
  isAddingProfile: false,
  isWhoIsWatching: false,
};

const profilesSlice = createSlice({
  name: 'profiles',
  initialState,
  reducers: {
    setCurrentProfile(state, { payload }: PayloadAction<string>) {
      state.currentProfile = payload;
    },

    //Choosing profile avatar
    choosingIcon(state) {
      state.isChoosing = true;
    },
    isNotchoosingIcon(state) {
      state.isChoosing = false;
    },

    //Manage profile and icon or not
    profileIsManaging(state, { payload }: PayloadAction<DocumentData | Profile>) {
      state.isManagingProfile = true;
      state.managingProfile = payload;
    },
    setManagingIcon(state, { payload }: PayloadAction<string>) {
      state.managingIcon = payload;
    },
    notManagingProfile(state) {
      state.isManagingProfile = false;
      state.managingIcon = '';
      state.managingProfile = { name: '', profileIcon: '' };
    },

    //Adding profile and icon or not
    addingNewProfile(state) {
      state.isAddingProfile = true;
    },
    notAddingNewProfile(state) {
      state.isAddingProfile = false;
      state.managingIcon = '';
    },

    //Who is watching on manage page or not
    setIsWhoIsWatching(state) {
      state.isWhoIsWatching = true;
    },
    setNotWhoIsWatching(state) {
      state.isWhoIsWatching = false;
    },
  },
});

export const profilesSelector = (state: RootState) => state.profiles;
export const {
  isNotchoosingIcon,
  choosingIcon,
  setCurrentProfile,
  setManagingIcon,
  profileIsManaging,
  notManagingProfile,
  addingNewProfile,
  notAddingNewProfile,
  setIsWhoIsWatching,
  setNotWhoIsWatching,
} = profilesSlice.actions;

export default profilesSlice.reducer;
