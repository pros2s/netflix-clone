import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface IPrivateSettingsState {
  isLoginChanging: boolean;
  isPasswordChanging: boolean;
}

const initialState: IPrivateSettingsState = {
  isLoginChanging: false,
  isPasswordChanging: false,
};

const privateSettingsSlice = createSlice({
  name: 'privateSettings',
  initialState,
  reducers: {
    loginIsChanging(state) {
      state.isLoginChanging = true;
    },
    passwordIsChanging(state) {
      state.isPasswordChanging = true;
    },
    loginIsNotChanging(state) {
      state.isLoginChanging = false;
    },
    passwordIsNotChanging(state) {
      state.isPasswordChanging = false;
    },
  },
});

export const privateSettingsSelector = (state: RootState) => state.privateSettings;
export const { loginIsChanging, loginIsNotChanging, passwordIsChanging, passwordIsNotChanging } =
  privateSettingsSlice.actions;

export default privateSettingsSlice.reducer;
