import Head from 'next/head';
import Link from 'next/link';
import { FC, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { useTypedDispatch } from '../hooks/useTypedDispatch';
import { loginIsNotChanging } from '../store/slices/privateSettings';

const LoginChanging: FC = () => {
  const dispatch = useTypedDispatch();
  const { setNewEmail, reAuth } = useAuth();

  const [passwordValue, setPasswordValue] = useState<string>('');
  const [emailValue, setEmailValue] = useState<string>('');

  const [isPasswordCorrect, setIsPasswordCorrect] = useState<boolean>(true);
  const [isEmailCorrect, setIsEmailCorrect] = useState<boolean>(true);
  const [isPasswordConfirmed, setIsPasswordConfirmed] = useState<boolean>(false);

  const confirmCurrentPassword = () => {
    setIsPasswordConfirmed(true);
    setIsPasswordCorrect(true);

    reAuth(passwordValue).catch((error) => {
      setIsPasswordConfirmed(false);
      error.message.match(/wrong-password/gi) ? setIsPasswordCorrect(false) : alert(error.message);
    });
  };

  const confirmNewEmail = () => {
    if (!emailValue || !emailValue.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/gi)) {
      setIsEmailCorrect(false);
      return;
    }

    dispatch(loginIsNotChanging());
    setNewEmail(emailValue);
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
        <h1 className='text-4xl font-semibold'>
          {!isPasswordConfirmed ? 'Enter your password' : 'Enter your new email'}
        </h1>
        <div className='space-y-4'>
          <label className='inline-block w-full'>
            {!isPasswordConfirmed ? (
              <div>
                <input
                  value={passwordValue}
                  onChange={(e) => {
                    setIsPasswordCorrect(true);
                    setPasswordValue(e.target.value);
                  }}
                  type='password'
                  required
                  placeholder='Your password'
                  className='input'
                />
                {!isPasswordCorrect && (
                  <p className='absolute text-sm text-red-600 pl-2 '>Wrong password. Try again</p>
                )}
              </div>
            ) : (
              <div>
                <input
                  value={emailValue}
                  onChange={(e) => setEmailValue(e.target.value)}
                  required
                  type='email'
                  placeholder='Email'
                  className='input'
                />
                {!isEmailCorrect && (
                  <p className='absolute text-sm text-red-600 pl-2 '>
                    Email address is not correct. Try again
                  </p>
                )}
              </div>
            )}
          </label>
        </div>

        {!isPasswordConfirmed ? (
          <button
            className='w-full rounded bg-[#e50914] py-3 font-semibold'
            type='submit'
            onClick={confirmCurrentPassword}>
            Next
          </button>
        ) : (
          <button
            className='w-full rounded bg-[#e50914] py-3 font-semibold'
            type='submit'
            onClick={confirmNewEmail}>
            Confirm
          </button>
        )}

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
