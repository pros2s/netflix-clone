import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import useAuth from '../hooks/useAuth';

interface Inputs {
  email: string;
  password: string;
}

const login: NextPage = () => {
  const [login, setLogin] = useState(false);
  const { signIn, signUp } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (login) {
      await signIn(data.email, data.password);
    } else {
      await signUp(data.email, data.password);
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
        <h1 className='text-4xl font-semibold'>Sign In</h1>
        <div className='space-y-4'>
          <label className='inline-block w-full'>
            <input
              type='email'
              placeholder='Email'
              className='input'
              {...register('email', { required: true })}
            />
            {errors.email && (
              <p className='p-1 text-[13px] font-light text-orange-500'>
                Please enter a valid email.
              </p>
            )}
          </label>
          <label className='inline-block w-full'>
            <input
              type='password'
              placeholder='Password'
              className='input'
              {...register('password', { required: true })}
            />
            {errors.password && (
              <p className='p-1 text-[13px] font-light  text-orange-500'>
                Your password must contain between 4 and 60 characters.
              </p>
            )}
          </label>
        </div>

        <button
          className='w-full rounded bg-[#e50914] py-3 font-semibold'
          type='submit'
          onClick={() => setLogin(true)}>
          Sign In
        </button>

        <div className='text-[gray]'>
          New to Netflix?{' '}
          <button
            className='cursor-pointer text-white hover:underline'
            type='submit'
            onClick={() => setLogin(false)}>
            Sign up now
          </button>
        </div>
      </form>
    </div>
  );
};

export default login;
