import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Plan } from '../../types';
import { RootState } from '../store';

interface ISubcriptionState {
  isSubscription: boolean;
  isChangingPlan: boolean;
  plan: Plan | null;
  startDate: Date | null;
}

const initialState: ISubcriptionState = {
  isSubscription: false,
  isChangingPlan: false,
  plan: null,
  startDate: null,
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
    userCurrentPlan(state, { payload }: PayloadAction<Plan>) {
      state.plan = payload;
    },
    userPlanStartDate(state, { payload }: PayloadAction<Date>) {
      state.startDate = payload;
    },
    userIsChangingPlan(state) {
      state.isChangingPlan = true;
    },
    userIsNotChangingPlan(state) {
      state.isChangingPlan = false;
    },
  },
});

export const subscriptionSelector = (state: RootState) => state.subscription;
export const {
  userSubscribed,
  userUnsubscribed,
  userCurrentPlan,
  userPlanStartDate,
  userIsChangingPlan,
  userIsNotChangingPlan,
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
