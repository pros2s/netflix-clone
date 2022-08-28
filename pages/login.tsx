import { MouseEvent, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';

import useAuth from '../hooks/useAuth';
import Loader from '../components/Loader';

interface Inputs {
  email: string;
  password: string;
  equalPassword: string;
}

const login: NextPage = () => {
  const [isSignIn, setIsSignIn] = useState<boolean>(true);
  const [isSignUp, setIsSignUp] = useState<boolean>(false);

  const [isEqualPasswords, setIsEqualPasswords] = useState<boolean>(true);
  const [isWrongPassword, setIsWrongPassword] = useState<boolean>(false);

  const [doesEmailAlreadyExist, setIDoesEmailAlreadyExist] = useState<boolean>(false);
  const [isExistUser, setIsExistUser] = useState<boolean>(true);

  const { signIn, signUp, loading } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const emailValidation = {
    required: true,
    pattern:
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    onChange: () => {
      setIDoesEmailAlreadyExist(false);
      setIsExistUser(true);
    },
  };

  const passwordValidation = {
    min: 6,
    max: 60,
    required: true,
    onChange: () => setIsWrongPassword(false),
  };

  const buttonClickHandler = (e: MouseEvent<HTMLButtonElement>) => {
    if (isSignIn) {
      e.preventDefault();
      setIsSignIn(false);
      setIsSignUp(true);
    } else {
      setIsSignIn(true);
      setIsSignUp(false);
    }
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    isSignIn &&
      (await signIn(data.email, data.password).catch((error) => {
        if (error.message.match(/user-not-found/gi)) {
          setIsExistUser(false);
        } else if (error.message.match(/wrong-password/gi)) {
          setIsWrongPassword(true);
        } else {
          alert(error.message);
        }
      }));

    if (isSignUp) {
      if (data.password === data.equalPassword) {
        await signUp(data.email, data.password).catch((error) =>
          error.message.match(/email-already-in-use/gi)
            ? setIDoesEmailAlreadyExist(true)
            : alert(error.message),
        );
        setIsEqualPasswords(true);
      } else {
        setIsEqualPasswords(false);
      }
    }
  };

  return (
    <div className='relative flex h-screen w-screen flex-col bg-black md:items-center md:justify-center md:bg-transparent selection:bg-red-600 selection:text-white'>
      <Head>
        <title>Netflix</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Image
        src='https://rb.gy/p2hphi'
        layout='fill'
        objectFit='cover'
        className='-z-10 !hidden opacity-60 sm:!inline'
        alt='wallpaper'
      />

      <img
        src='https://rb.gy/ulxxee'
        alt='icon'
        width={150}
        height={150}
        className='absolute left-4 top-4 cursor-pointer object-contain md:left-10 md:top-6'
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className='relative mt-24 space-y-8 rounded bg-black/75 py-10 px-6 md:mt-0 md:max-w-md md:px-14'>
        <h1 className='text-4xl font-semibold'>{isSignIn ? 'Sign In' : 'Sign Up'}</h1>
        <div className='space-y-4'>
          <label className='inline-block w-full'>
            <input
              type='email'
              placeholder='Email'
              className='input'
              {...register('email', emailValidation)}
            />
            {errors.email && (
              <p className='p-1 text-[13px] font-light text-orange-500'>
                Please enter a valid email.
              </p>
            )}
            {doesEmailAlreadyExist && isSignUp && (
              <p className='p-1 text-[13px] font-light text-orange-500'>
                Email already exists. Please enter a correct email.
              </p>
            )}
            {!isExistUser && isSignIn && (
              <p className='p-1 text-[13px] font-light text-orange-500'>
                Email does not exist. Please enter a correct email.
              </p>
            )}
          </label>
          <label className='inline-block w-full'>
            <input
              type='password'
              placeholder='Password'
              className='input'
              {...register('password', passwordValidation)}
            />
            {errors.password && (
              <p className='p-1 text-[13px] font-light  text-orange-500'>
                Your password must contain between 6 and 60 characters.
              </p>
            )}
            {isSignIn && isWrongPassword && (
              <p className='p-1 text-[13px] font-light  text-orange-500'>
                Wrong password. Please enter a correct password.
              </p>
            )}
          </label>
          {isSignUp && (
            <label className='inline-block w-full'>
              <input
                type='password'
                placeholder='Repeat password'
                className='input'
                {...register('equalPassword', {
                  required: true,
                  onChange: () => setIsEqualPasswords(true),
                })}
              />
              {errors.equalPassword && (
                <p className='p-1 text-[13px] font-light  text-orange-500'>
                  Your password must contain between 6 and 60 characters.
                </p>
              )}
              {!isEqualPasswords && (
                <p className='p-1 text-[13px] font-light  text-orange-500'>
                  Passwords is not equal.
                </p>
              )}
            </label>
          )}
        </div>

        <button className='w-full rounded bg-[#e50914] py-3 font-semibold' type='submit'>
          {loading ? <Loader color='dark:fill-gray-300' /> : isSignIn ? 'Sign In' : 'Sign Up'}
        </button>

        <div className='text-[gray]'>
          {isSignIn ? 'New to Netflix? ' : 'Already have account? '}
          <button
            className='cursor-pointer text-white hover:underline'
            type='button'
            onClick={(e) => buttonClickHandler(e)}>
            {isSignIn ? 'Sign up now' : 'Sign in'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default login;
