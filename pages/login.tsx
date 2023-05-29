import { MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';

import Loader from '../components/UI/Loader';
import ErrorMessage from '../components/UI/ErrorMessage';
import Footer from '../components/UI/Footer';

import { userUnsubscribed } from '../store/slices/sutbscription';
import { choosingIcon, setCurrentProfile } from '../store/slices/profiles';

import { useTypedDispatch } from '../hooks/useTypedDispatch';
import useAuth from '../hooks/useAuth';

import netflix from '../assets/qionix.png';
import wallpaper from '../assets/netflix.jpg';
import wallpaper2 from '../assets/login.jpg';
import wallpaper3 from '../assets/xx.png';

interface Inputs {
  email: string;
  password: string;
  equalPassword: string;
  username: string;
}

const login: NextPage = () => {
  const { signIn, signUp, loading, user } = useAuth();
  const router = useRouter();

  const dispatch = useTypedDispatch();
  const passwordRef = useRef<HTMLDivElement>(null);
  const eqPasswordRef = useRef<HTMLDivElement>(null);

  const [isSignIn, setIsSignIn] = useState<boolean>(true);
  const [isSignUp, setIsSignUp] = useState<boolean>(false);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showEqPassword, setShowEqPassword] = useState<boolean>(false);

  const [usernameValue, setUsernameValue] = useState<string>('');
  const [emailValue, setEmailValue] = useState<string>('');
  const [passwordValue, setPasswordValue] = useState<string>('');
  const [equalPasswordValue, setEqualPasswordValue] = useState<string>('');

  const [isEqualPasswords, setIsEqualPasswords] = useState<boolean>(true);
  const [isWrongPassword, setIsWrongPassword] = useState<boolean>(false);
  const [isWeakPassword, setIsWeakPassword] = useState<boolean>(false);

  const [isExistEmail, setIsExistEmail] = useState<boolean>(false);
  const [isExistUser, setIsExistUser] = useState<boolean>(true);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<Inputs>();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, []);

  const usernameValidation = {
    min: 2,
    max: 20,
    required: true,
    onChange: () => {
      setUsernameValue(getValues('username'));
    },
  };

  const emailValidation = {
    required: true,
    pattern:
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    onChange: () => {
      setEmailValue(getValues('email'));
      setIsExistEmail(false);
      setIsExistUser(true);
    },
  };

  const passwordValidation = {
    min: 6,
    max: 60,
    required: true,
    onChange: () => {
      setPasswordValue(getValues('password'));
      setIsWrongPassword(false);
      setIsWeakPassword(false);
    },
  };

  const equalPasswordValidation = {
    required: true,
    onChange: () => {
      setEqualPasswordValue(getValues('equalPassword'));
      setIsEqualPasswords(true);
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
    [isSignIn]
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
          dispatch(setCurrentProfile(data.username.toLocaleLowerCase()));
        } else {
          setIsEqualPasswords(false);
        }

        dispatch(userUnsubscribed());
        dispatch(choosingIcon());
      }
    },
    [isSignIn, isSignUp]
  );

  const wichWallpaper = useMemo(() => {
    const rand = Math.random();

    if (rand > 0.66) return wallpaper;
    if (rand < 0.66 && rand > 0.33) return wallpaper2;

    return wallpaper3;
  }, []);

  return (
    <div className='relative flex h-screen w-screen flex-col bg-gradient-to-t from-black/60 via-black/[0.05] to-black/60 bg-black md:items-center md:justify-center md:bg-transparent selection:bg-red-600 selection:text-white'>
      <Head>
        <title>Qionix</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Image
        src={wichWallpaper}
        layout='fill'
        objectFit='cover'
        className='-z-10 !hidden opacity-60 sm:!inline md:cursor-pointer'
        alt='wallpaper'
      />

      <div className='absolute left-4 top-4 cursor-pointer object-contain md:left-10 md:top-6'>
        <Image className='md:cursor-pointer' src={netflix} alt='icon' width={150} height={35} />
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className='relative mt-24 space-y-5 rounded bg-black/75 py-8 px-6 md:mt-0 md:max-w-md md:px-14'
      >
        <h1 className='text-4xl font-semibold'>{isSignIn ? 'Sign In' : 'Sign Up'}</h1>
        <div className='space-y-4'>
          {isSignUp && (
            <label className='inline-block w-full'>
              <div ref={eqPasswordRef} className='relative group'>
                <input
                  type='text'
                  id='username'
                  className='input'
                  {...register('username', usernameValidation)}
                />

                <label
                  htmlFor='username'
                  className={`placeholder ${usernameValue ? 'placeholderIn' : 'placeholderOut'}`}
                >
                  Your name
                </label>
              </div>

              <ErrorMessage
                isCheck={!!errors.username}
                message='Your name must contain between 2 and 20 characters.'
              />
            </label>
          )}

          <label className='inline-block w-full'>
            <div className='relative group'>
              <input
                type='email'
                id='emailInput'
                className='input'
                {...register('email', emailValidation)}
              />
              <label
                htmlFor='emailInput'
                className={`placeholder ${emailValue ? 'placeholderIn' : 'placeholderOut'}`}
              >
                Email
              </label>
            </div>

            <ErrorMessage isCheck={!!errors.email} message='Please enter a valid email.' />
            <ErrorMessage
              isCheck={isExistEmail && isSignUp}
              message='Email already exists. Please enter a correct email.'
            />
            <ErrorMessage
              isCheck={!isExistUser && isSignIn}
              message='Email does not exist. Please enter a correct email or create a new account.'
            />
          </label>

          <label className='inline-block w-full'>
            <div ref={passwordRef} className='relative group'>
              <input
                type={showPassword ? 'text' : 'password'}
                id='passwordInput'
                className='input'
                {...register('password', passwordValidation)}
              />
              <label
                htmlFor='passwordInput'
                className={`placeholder ${passwordValue ? 'placeholderIn' : 'placeholderOut'}`}
              >
                Password
              </label>

              <button
                type='button'
                className='opacity-0 pointer-events-none transition-opacity absolute top-3 right-3 text-[darkgray] uppercase group-focus-within:opacity-100 group-focus-within:pointer-events-auto'
                onClick={() => {
                  passwordRef.current?.click();
                  setShowPassword((state) => !state);
                }}
              >
                {showPassword ? 'hide' : 'show'}
              </button>
            </div>

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
              <div ref={eqPasswordRef} className='relative group'>
                <input
                  type={showEqPassword ? 'text' : 'password'}
                  id='equalpassword'
                  className='input'
                  {...register('equalPassword', equalPasswordValidation)}
                />

                <label
                  htmlFor='equalpassword'
                  className={`placeholder ${
                    equalPasswordValue ? 'placeholderIn' : 'placeholderOut'
                  }`}
                >
                  Repeat password
                </label>

                <button
                  type='button'
                  className='opacity-0 pointer-events-none absolute top-3 right-3 transition-opacity text-[darkgray] uppercase group-focus-within:opacity-100 group-focus-within:pointer-events-auto'
                  onClick={() => {
                    eqPasswordRef.current?.click();
                    setShowEqPassword((state) => !state);
                  }}
                >
                  {showEqPassword ? 'hide' : 'show'}
                </button>
              </div>

              <ErrorMessage
                isCheck={!!errors.equalPassword}
                message='Your password must contain between 6 and 60 characters.'
              />
              <ErrorMessage isCheck={!isEqualPasswords} message='Passwords is not equal.' />
            </label>
          )}
        </div>

        <button className='w-full rounded bg-[#e50914] py-3 font-semibold' type='submit'>
          {loading ? (
            <Loader color='dark:fill-gray-300' height='6' width='14' />
          ) : isSignIn ? (
            'Sign In'
          ) : (
            'Sign Up'
          )}
        </button>

        <div className='text-[gray]'>
          {isSignIn ? 'New to Qionix? ' : 'Already have account? '}
          <button
            className='cursor-pointer text-white md:hover:underline'
            type='button'
            onClick={(e) => buttonClickHandler(e)}
          >
            {isSignIn ? 'Sign up now' : 'Sign in'}
          </button>
        </div>
      </form>
      <Footer isAbsolute={true} />
    </div>
  );
};

export default login;
