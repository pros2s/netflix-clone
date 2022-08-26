import Head from 'next/head';
import Link from 'next/link';
import { FC, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { useTypedDispatch } from '../hooks/useTypedDispatch';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { loginIsNotChanging } from '../store/slices/privateSettings';

const LoginChanging: FC = () => {
  const dispatch = useTypedDispatch();
  const { setNewEmail } = useAuth();
  const [inputValue, setInputValue] = useState<string>('');

  const confirmNewEmail = async () => {
    dispatch(loginIsNotChanging());
    await setNewEmail(inputValue);
  };

  return (
    <div className='relative flex h-screen w-screen flex-col bg-black md:items-center md:justify-center md:bg-transparent selection:bg-red-600 selection:text-white'>
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
      </header>
      <form className='relative mt-24 space-y-8 rounded bg-black/75 py-5 px-6 md:mt-0 md:max-w-lg md:px-14'>
        <h1 className='text-4xl font-semibold'>Enter your new email</h1>
        <div className='space-y-4'>
          <label className='inline-block w-full'>
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              type='email'
              required
              placeholder='Email'
              className='input'
            />
          </label>
        </div>

        <button
          className='w-full rounded bg-[#e50914] py-3 font-semibold'
          type='submit'
          onClick={confirmNewEmail}>
          Confirm
        </button>

        <button
          className='membershipLink text-center w-full'
          onClick={() => dispatch(loginIsNotChanging())}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default LoginChanging;
