import { ChangeEvent, FC, MouseEvent, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

import useAuth from '../hooks/useAuth';
import { useTypedDispatch } from '../hooks/useTypedDispatch';

import { loginIsNotChanging } from '../store/slices/privateSettings';
import Loader from './Loader';

const EmailChanging: FC = () => {
  const dispatch = useTypedDispatch();
  const { setNewEmail, reAuth, loading } = useAuth();

  const [passwordValue, setPasswordValue] = useState<string>('');
  const [emailValue, setEmailValue] = useState<string>('');

  const [isWeakPassword, setIsWeakPassword] = useState<boolean>(false);
  const [isPasswordCorrect, setIsPasswordCorrect] = useState<boolean>(true);
  const [isPasswordConfirmed, setIsPasswordConfirmed] = useState<boolean>(false);
  const [isEmailCorrect, setIsEmailCorrect] = useState<boolean>(true);

  const confirmCurrentPassword = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsPasswordConfirmed(true);
    setIsPasswordCorrect(true);

    if (!passwordValue) {
      setIsPasswordConfirmed(false);
      setIsWeakPassword(true);
      return;
    }

    await reAuth(passwordValue).catch((error) => {
      setIsPasswordConfirmed(false);
      error.message.match(/wrong-password/gi) ? setIsPasswordCorrect(false) : alert(error.message);
    });
  };

  const confirmNewEmail = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!emailValue || !emailValue.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/gi)) {
      setIsEmailCorrect(false);
      return;
    }
    dispatch(loginIsNotChanging());
    await setNewEmail(emailValue);
  };

  const handleInputsChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!isPasswordConfirmed) {
      setIsPasswordCorrect(true);
      setIsWeakPassword(false);
      setPasswordValue(e.target.value);
    } else {
      setEmailValue(e.target.value);
    }
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

      <form
        noValidate
        className='relative mt-24 space-y-8 rounded bg-black/75 py-5 px-6 md:mt-0 md:max-w-lg md:px-14'>
        <h1 className='text-4xl font-semibold'>
          {!isPasswordConfirmed ? 'Enter your password' : 'Enter your new email'}
        </h1>

        <div className='space-y-4'>
          <label className='inline-block w-full'>
            <div>
              <input
                value={!isPasswordConfirmed ? passwordValue : emailValue}
                onChange={(e) => handleInputsChange(e)}
                type={!isPasswordConfirmed ? 'password' : 'email'}
                required
                placeholder={!isPasswordConfirmed ? 'Your password' : 'New Email'}
                className='input'
              />
              {!isPasswordCorrect && (
                <p className='absolute text-sm text-red-600 pl-2 '>Wrong password. Try again</p>
              )}
              {!isEmailCorrect && (
                <p className='absolute text-sm text-red-600 pl-2 '>
                  Email address is not correct. Try again
                </p>
              )}
              {isWeakPassword && (
                <p className='absolute text-sm text-red-600 pl-2 '>
                  Password should be at least 6 characters
                </p>
              )}
            </div>
          </label>
        </div>

        <button
          className='w-full rounded bg-[#e50914] py-3 font-semibold'
          type='submit'
          onClick={(e) => {
            !isPasswordConfirmed ? confirmCurrentPassword(e) : confirmNewEmail(e);
          }}>
          {loading ? (
            <Loader color='dark:fill-gray-300' />
          ) : !isPasswordConfirmed ? (
            'Next'
          ) : (
            'Confirm'
          )}
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

export default EmailChanging;
