import { MouseEvent, useCallback, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';

import useAuth from '../hooks/useAuth';
import Loader from '../components/UI/Loader';
import { userSubscribed, userUnsubscribed } from '../store/slices/sutbscription';
import { useTypedDispatch } from '../hooks/useTypedDispatch';

import netflix from '../assets/netflix.png';
import ErrorMessage from '../components/UI/ErrorMessage';

interface Inputs {
  email: string;
  password: string;
  equalPassword: string;
}

const login: NextPage = () => {
  const dispatch = useTypedDispatch();
  const [isSignIn, setIsSignIn] = useState<boolean>(true);
  const [isSignUp, setIsSignUp] = useState<boolean>(false);

  const [isEqualPasswords, setIsEqualPasswords] = useState<boolean>(true);
  const [isWrongPassword, setIsWrongPassword] = useState<boolean>(false);
  const [isWeakPassword, setIsWeakPassword] = useState<boolean>(false);

  const [isExistEmail, setIsExistEmail] = useState<boolean>(false);
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
      setIsExistEmail(false);
      setIsExistUser(true);
    },
  };

  const passwordValidation = {
    min: 6,
    max: 60,
    required: true,
    onChange: () => {
      setIsWrongPassword(false);
      setIsWeakPassword(false);
    },
  };

  const buttonClickHandler = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      if (isSignIn) {
        e.preventDefault();
        setIsSignIn(false);
        setIsSignUp(true);
      } else {
        setIsSignIn(true);
        setIsSignUp(false);
      }
    },
    [isSignIn],
  );

  const onSubmit: SubmitHandler<Inputs> = useCallback(
    async (data) => {
      if (isSignIn) {
        await signIn(data.email, data.password).catch((error) => {
          if (error.message.match(/user-not-found/gi)) {
            setIsExistUser(false);
          } else if (error.message.match(/wrong-password/gi)) {
            setIsWrongPassword(true);
          } else {
            alert(error.message);
          }
        });

        dispatch(userSubscribed());
      }

      if (isSignUp) {
        if (data.password === data.equalPassword) {
          await signUp(data.email, data.password).catch((error) => {
            if (error.message.match(/email-already-in-use/gi)) {
              setIsExistEmail(true);
            } else if (error.message.match(/weak-password/gi)) {
              setIsWeakPassword(true);
            } else {
              alert(error.message);
            }
          });
          setIsEqualPasswords(true);
        } else {
          setIsEqualPasswords(false);
        }

        dispatch(userUnsubscribed());
      }
    },
    [isSignIn, isSignUp],
  );

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

      <div className='absolute left-4 top-4 cursor-pointer object-contain md:left-10 md:top-6'>
        <Image src={netflix} alt='icon' width={150} height={50} />
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
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
            <ErrorMessage isCheck={!!errors.email} message='Please enter a valid email.' />
            <ErrorMessage
              isCheck={isExistEmail && isSignUp}
              message='Email already exists. Please enter a correct email.'
            />
            <ErrorMessage
              isCheck={!isExistUser && isSignIn}
              message='Email does not exist. Please enter a correct email.'
            />
          </label>
          <label className='inline-block w-full'>
            <input
              type='password'
              placeholder='Password'
              className='input'
              {...register('password', passwordValidation)}
            />
            <ErrorMessage
              isCheck={!!errors.password}
              message='Your password must contain between 6 and 60 characters.'
            />
            <ErrorMessage
              isCheck={isSignIn && isWrongPassword}
              message='Wrong password. Please enter a correct password.'
            />
            <ErrorMessage
              isCheck={isSignUp && isWeakPassword}
              message='Password should be at least 6 characters'
            />
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
              <ErrorMessage
                isCheck={!!errors.equalPassword}
                message='Your password must contain between 6 and 60 characters.'
              />
              <ErrorMessage isCheck={!isEqualPasswords} message='Passwords is not equal.' />
            </label>
          )}
        </div>

        <button className='w-full rounded bg-[#e50914] py-3 font-semibold' type='submit'>
          {loading ? <Loader color='dark:fill-gray-300' /> : isSignIn ? 'Sign In' : 'Sign Up'}
        </button>

        <div className='text-[gray]'>
          {isSignIn ? 'New to Netflix? ' : 'Already have account? '}
          <button
            className='cursor-pointer text-white md:hover:underline'
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
