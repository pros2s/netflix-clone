import { FC, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { CheckIcon } from '@heroicons/react/outline';
import PlanTable from './PlanTable';

import { subsBenefits, subsPlans } from '../utils/subscription';
import useAuth from '../hooks/useAuth';
import { Plan } from '../types';
import { useTypedDispatch } from '../hooks/useTypedDispatch';
import { userSubscribed } from '../store/slices/sutbscription';

const Plans: FC = () => {
  const { logout, user } = useAuth();
  const dispatch = useTypedDispatch();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const subscribeToPlan = () => {
    if (!user) return;

    dispatch(userSubscribed());
  };

  return (
    <div className='selection:bg-red-600 selection:text-white'>
      <Head>
        <title>Netflix</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <header className='border-b border-white/10 bg-[#141414]'>
        <Link href='/'>
          <img
            src='https://rb.gy/ulxxee'
            alt='Netflix'
            width={150}
            height={90}
            className='cursor-pointer object-contain'
          />
        </Link>
        <button className='text-lg font-medium hover:underline' onClick={logout}>
          Sign Out
        </button>
      </header>

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
                onClick={() => setSelectedPlan(plan)}>
                {plan.name}
              </div>
            ))}
          </div>

          <PlanTable plans={subsPlans} selectedPlan={selectedPlan} />

          <button
            disabled={!selectedPlan}
            className={`mx-auto w-11/12 cursor-pointer rounded bg-[#E50914] py-4 text-xl shadow hover:bg-[#f6121d] md:w-[420px] ${
              !selectedPlan && 'opacity-60 cursor-default hover:bg-[#E50914]'
            }`}
            onClick={subscribeToPlan}>
            Subscribe
          </button>
        </div>
      </main>
    </div>
  );
};

export default Plans;
