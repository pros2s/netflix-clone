import { FC, useState, useRef } from 'react';
import Image from 'next/image';
import Head from 'next/head';

import { doc, setDoc } from 'firebase/firestore';
import { getStorage, ref as storageRef } from 'firebase/storage';
import { db } from '../firebase';

import Footer from './UI/Footer';
import MiniHeader from './UI/MiniHeader';

import { useTypedDispatch } from '../hooks/useTypedDispatch';
import { useTypedSelector } from '../hooks/useTypedSelector';
import useAuth from '../hooks/useAuth';

import { isNotchoosingIcon, profilesSelector, setManagingIcon } from '../store/slices/profiles';
import { icons } from '../utils/icons';

interface ChosingIconProps {
  isManage: boolean;
}

const ChosingIcon: FC<ChosingIconProps> = ({ isManage }) => {
  const dispatch = useTypedDispatch();
  const { currentProfile } = useTypedSelector(profilesSelector);
  const { user } = useAuth();
  const choseIconRef = useRef<HTMLButtonElement>(null);

  const [selectedIcon, setSelectedIcon] = useState<string>('');

  const onClickIcon = (icon: string) => {
    choseIconRef.current?.focus();
    setSelectedIcon(icon);
  };

  const chooseIcon = async () => {
    const storage = getStorage();
    const iconRef = storageRef(storage, selectedIcon);

    !isManage &&
      (await setDoc(doc(db, 'users', user?.uid!, 'profiles', currentProfile), {
        name: currentProfile,
        profileIcon: iconRef.name,
      }));

    dispatch(setManagingIcon(selectedIcon.slice(7)));
    dispatch(isNotchoosingIcon());
  };

  return (
    <>
      <Head>
        <title>Choose Icon</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <MiniHeader isSignOut={true} />

      <main className='relative h-screen flex flex-col items-center px-6'>
        <h1 className='pt-24 text-2xl font-semibold md:text-3xl lg:text-4xl'>
          Chose your profile icon
        </h1>

        <div className='flex flex-wrap justify-center items-center gap-1 md:gap-2 lg:gap-4 p-6 max-w-[38rem]'>
          {icons.map((icon) => (
            <button
              key={Math.random()}
              onClick={() => onClickIcon(icon)}
              className='h-16 w-16 md:h-24 md:w-24 lg:h-32 lg:w-32 transition hover:scale-[1.15] focus:scale-[1.15]'
            >
              <Image src={icon} width={128} height={128} />
            </button>
          ))}
        </div>

        <button
          ref={choseIconRef}
          disabled={!selectedIcon}
          className={`cursor-pointer rounded bg-[#E50914] py-3 text-xl shadow w-64 md:hover:bg-[#f6121d] ${
            !selectedIcon && 'opacity-60 cursor-default md:hover:bg-[#E50914]'
          }`}
          onClick={chooseIcon}
        >
          This icon is awesome!
        </button>

        <button
          type='button'
          onClick={() => dispatch(isNotchoosingIcon())}
          className='cursor-pointer mt-2 text-blue-500 md:hover:underline'
        >
          Cancel
        </button>
        <Footer isAbsolute={true} />
      </main>
    </>
  );
};

export default ChosingIcon;
