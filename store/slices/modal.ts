import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface IModalState {
  isOpenedModal: boolean;
  isMutedVideo: boolean;
}

const initialState: IModalState = {
  isOpenedModal: false,
  isMutedVideo: true,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    closeModal(state) {
      state.isOpenedModal = false;
    },
    openModal(state) {
      state.isOpenedModal = true;
    },
    toggleMuteVideo(state) {
      state.isMutedVideo = !state.isMutedVideo;
    },
  },
});

export const modalSelector = (state: RootState) => state.modal;
export const { closeModal, openModal, toggleMuteVideo } = modalSlice.actions;

export default modalSlice.reducer;
