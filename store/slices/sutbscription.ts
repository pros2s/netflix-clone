import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface ISubcriptionState {
  isSubscription: boolean;
}

const initialState: ISubcriptionState = {
  isSubscription: false,
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    userSubscribed(state) {
      state.isSubscription = true;
    },
    userUnsubscribed(state) {
      state.isSubscription = false;
    },
  },
});

export const subscriptionSelector = (state: RootState) => state.subscription;
export const { userSubscribed, userUnsubscribed } = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
