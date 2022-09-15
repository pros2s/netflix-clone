import { FC, useCallback, useState } from 'react';
import { CheckIcon } from '@heroicons/react/outline';
import Head from 'next/head';

import PlanTable from './UI/PlanTable';
import Footer from './UI/Footer';
import MiniHeader from './UI/MiniHeader';

import { useTypedDispatch } from '../hooks/useTypedDispatch';
import { useTypedSelector } from '../hooks/useTypedSelector';
import useAuth from '../hooks/useAuth';

import {
  subscriptionSelector,
  userCurrentPlan,
  userIsNotChangingPlan,
  userPlanStartDate,
  userSubscribed,
} from '../store/slices/sutbscription';

import { Plan } from '../types';
import { subsBenefits, subsPlans } from '../utils/subscription';

const Plans: FC = () => {
  const dispatch = useTypedDispatch();
  const { isChangingPlan } = useTypedSelector(subscriptionSelector);
  const { user } = useAuth();

  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const subscribeToPlan = useCallback(() => {
    if (!user) return;

    isChangingPlan && dispatch(userIsNotChangingPlan());

    selectedPlan && dispatch(userCurrentPlan(selectedPlan));
    dispatch(userPlanStartDate(new Date().toString()));
    dispatch(userSubscribed());
  }, [selectedPlan, isChangingPlan]);

  return (
    <div className='selection:bg-red-600 selection:text-white'>
      <Head>
        <title>Change Plan</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <MiniHeader isSignOut={true} />

      <main className='mx-auto max-w-5xl px-5 pt-28 pb-12 transition-all md:px-10'>
        <h1 className='mb-3 text-3xl font-medium'>Choose the plan that's right for you</h1>
        <ul>
          {subsBenefits.map((text) => (
            <li key={text} className='flex items-center gap-x-2 text-lg'>
              <CheckIcon className='h-7 w-7 text-[#E50914]' /> {text}
            </li>
          ))}
        </ul>

        <div className='mt-4 flex flex-col space-y-4'>
          <div className='flex w-full items-center justify-end self-end md:w-3/5'>
            {subsPlans.map((plan) => (
              <div
                className={`planBox ${selectedPlan?.id === plan.id ? 'opacity-100' : 'opacity-60'}`}
                key={plan.id}
                onClick={() => setSelectedPlan(plan)}
              >
                {plan.name}
              </div>
            ))}
          </div>

          <PlanTable plans={subsPlans} selectedPlan={selectedPlan} />

          <button
            disabled={!selectedPlan}
            className={`mx-auto w-11/12 cursor-pointer rounded bg-[#E50914] py-4 text-xl shadow md:hover:bg-[#f6121d] md:w-[420px] ${
              !selectedPlan && 'opacity-60 cursor-default md:hover:bg-[#E50914]'
            }`}
            onClick={subscribeToPlan}
          >
            {isChangingPlan ? 'Change plan' : 'Subscribe'}
          </button>

          {isChangingPlan && (
            <button className='membershipLink' onClick={() => dispatch(userIsNotChangingPlan())}>
              Cancel
            </button>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Plans;
