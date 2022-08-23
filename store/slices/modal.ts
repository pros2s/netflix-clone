import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface IModalState {
  isOpenedModal: boolean;
}

const initialState: IModalState = {
  isOpenedModal: false,
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
    toggleModal(state) {
      state.isOpenedModal = !state.isOpenedModal;
    },
  },
});

export const modalSelector = (state: RootState) => state.modal;
export const { closeModal, openModal, toggleModal } = modalSlice.actions;

export default modalSlice.reducer;
