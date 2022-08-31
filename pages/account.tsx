import { FC } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import dateFormat from 'dateformat';

import { useTypedDispatch } from '../hooks/useTypedDispatch';
import { useTypedSelector } from '../hooks/useTypedSelector';
import useAuth from '../hooks/useAuth';

import PasswordChanging from '../components/PasswordChanging';
import EmailChanging from '../components/EmailChanging';
import Membership from '../components/Membership';
import Plans from '../components/Plans';

import { subscriptionSelector, userIsChangingPlan } from '../store/slices/sutbscription';
import { privateSettingsSelector } from '../store/slices/privateSettings';

import netflix from '../assets/netflix.png';
import accountIcon from '../assets/account.png';
import Image from 'next/image';

const account: FC = () => {
  const dispatch = useTypedDispatch();
  const { logout } = useAuth();

  const { startDate, plan, isChangingPlan } = useTypedSelector(subscriptionSelector);
  const { isLoginChanging, isPasswordChanging } = useTypedSelector(privateSettingsSelector);

  const formatDate = dateFormat(startDate!);

  if (isLoginChanging) return <EmailChanging />;
  if (isPasswordChanging) return <PasswordChanging />;
  if (isChangingPlan) return <Plans />;

  return (
    <div className='selection:bg-red-600 selection:text-white'>
      <Head>
        <title>Account Settings - Netflix</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <header className='bg-[#141414]'>
        <Link href='/'>
          <a>
            <Image
              src={netflix}
              width={120}
              height={46}
              className='cursor-pointer object-contain'
              alt='logo'
            />
          </a>
        </Link>

        <Link href='/account'>
          <a>
            <Image
              src={accountIcon}
              width={32}
              height={32}
              alt='account'
              className='cursor-pointer rounded'
            />
          </a>
        </Link>
      </header>

      <main className='mx-auto max-w-6xl px-5 pt-24 pb-12 transition-all md:px-10'>
        <div className='flex flex-col gap-x-4 md:flex-row md:items-center'>
          <h1 className='text-3xl md:text-4xl'>Account</h1>
          <div className='-ml-0.5 flex items-center gap-x-1.5'>
            <img src='https://rb.gy/4vfk4r' alt='' className='h-7 w-7' />
            <p className='text-xs font-semibold text-[#555]'>Member since {formatDate}</p>
          </div>
        </div>

        <Membership />

        <div className='mt-6 grid grid-cols-1 gap-x-4 border px-4 py-4 md:grid-cols-4 md:border-x-0 md:border-t md:border-b-0 md:px-0 md:pb-0'>
          <h4 className='text-lg text-[gray]'>Plan Details</h4>
          <p className='col-span-2 font-medium'>{plan?.name}</p>
          <button
            className='cursor-pointer text-blue-500 md:hover:underline md:text-right'
            onClick={() => dispatch(userIsChangingPlan())}>
            Change plan
          </button>
        </div>

        <div className='mt-6 grid grid-cols-1 gap-x-4 border px-4 py-4 md:grid-cols-4 md:border-x-0 md:border-t md:border-b-0 md:px-0'>
          <h4 className='text-lg text-[gray]'>Settings</h4>
          <button
            className='text-start col-span-3 cursor-pointer text-blue-500 md:hover:underline'
            onClick={logout}>
            Sign out of all devices
          </button>
        </div>
      </main>
    </div>
  );
};

export default account;
