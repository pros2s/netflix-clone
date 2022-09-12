import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DocumentData } from 'firebase/firestore';
import { Profile } from '../../types';
import { RootState } from '../store';

interface IProfilesState {
  currentProfile: string;
  choosing: boolean;
  profileIcon: string;
  managingProfile: DocumentData | Profile;
  isManagingProfile: boolean;
  managingIcon: string;
  isAddingProfile: boolean;
}

const initialState: IProfilesState = {
  currentProfile: '',
  choosing: false,
  profileIcon: '',
  managingProfile: {
    name: '',
    profileIcon: '',
  },
  isManagingProfile: false,
  managingIcon: '',
  isAddingProfile: false,
};

const profilesSlice = createSlice({
  name: 'profiles',
  initialState,
  reducers: {
    setCurrentProfile(state, { payload }: PayloadAction<string>) {
      state.currentProfile = payload;
    },
    choosingIcon(state) {
      state.choosing = true;
    },
    isNotchoosingIcon(state) {
      state.choosing = false;
    },
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
    addingNewProfile(state) {
      state.isAddingProfile = true;
    },
    notAddingNewProfile(state) {
      state.isAddingProfile = false;
      state.managingIcon = '';
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
} = profilesSlice.actions;

export default profilesSlice.reducer;
