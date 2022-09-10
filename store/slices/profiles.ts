import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DocumentData } from 'firebase/firestore';
import { Profile } from '../../types';
import { RootState } from '../store';

interface IProfilesState {
  currentProfile: string;
  choosing: boolean;
  profileIcon: string;
  editingProfile: DocumentData | Profile;
  isEditingProfile: boolean;
  editingIcon: string;
}

const initialState: IProfilesState = {
  currentProfile: '',
  choosing: false,
  profileIcon: '',
  editingProfile: {
    name: '',
    profileIcon: '',
  },
  isEditingProfile: false,
  editingIcon: '',
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
    editingProfile(state, { payload }: PayloadAction<DocumentData | Profile>) {
      state.isEditingProfile = true;
      state.editingProfile = payload;
    },
    setEditingIcon(state, {payload}: PayloadAction<string>) {
      state.editingIcon = payload;
    },
    notEditingProfile(state) {
      state.isEditingProfile = false;
    },
  },
});

export const profilesSelector = (state: RootState) => state.profiles;
export const {
  isNotchoosingIcon,
  choosingIcon,
  setCurrentProfile,
  setEditingIcon,
  editingProfile,
  notEditingProfile
} = profilesSlice.actions;

export default profilesSlice.reducer;
