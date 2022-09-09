import { FC, useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import Head from 'next/head';

import { useTypedDispatch } from '../hooks/useTypedDispatch';

import netflix from '../assets/netflix.png';
import { icons } from '../utils/icons';
import { doc, setDoc } from 'firebase/firestore';
import { getStorage, ref as storageRef } from 'firebase/storage';
import { db } from '../firebase';
import useAuth from '../hooks/useAuth';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { choosedIcon, profilesSelector } from '../store/slices/profiles';

const ChosingIcon: FC = () => {
  const dispatch = useTypedDispatch();
  const { profiles } = useTypedSelector(profilesSelector);
  const { user } = useAuth();

  const [selectedIcon, setSelectedIcon] = useState<StaticImageData>();

  const selectIcon = (icon: StaticImageData) => {
    setSelectedIcon(icon);
  };

  const createProfile = async () => {
    const storage = getStorage();
    const iconRef = storageRef(storage, selectedIcon?.src);

    await setDoc(doc(db, 'users', user?.uid!, 'profiles', profiles[0]), {
      profileIcon: iconRef.name,
    });

    dispatch(choosedIcon());
  };

  return (
    <div>
      <Head>
        <title>Netflix</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <header className='border-b border-white/10 bg-[#141414]'>
        <Image className='md:cursor-pointer' src={netflix} alt='icon' width={120} height={33} />
      </header>

      <div className='flex flex-col items-center px-6'>
        <h1 className='pt-24 text-2xl font-semibold md:text-3xl lg:text-4xl'>
          Chose your profile icon
        </h1>

        <div className='flex flex-wrap justify-center items-center gap-1 md:gap-2 lg:gap-4 p-6 max-w-[38rem]'>
          {icons.map((icon) => (
            <button
              key={Math.random()}
              onClick={() => selectIcon(icon)}
              className='h-16 w-16 md:h-24 md:w-24 lg:h-32 lg:w-32 transition focus:scale-[1.15]'
            >
              <Image src={icon} />
            </button>
          ))}
        </div>

        <button
          disabled={!selectedIcon}
          className={`cursor-pointer rounded bg-[#E50914] py-3 text-xl shadow w-64 md:hover:bg-[#f6121d] ${
            !selectedIcon && 'opacity-60 cursor-default md:hover:bg-[#E50914]'
          }`}
          onClick={createProfile}
        >
          This icon is awesome!
        </button>
      </div>
    </div>
  );
};

export default ChosingIcon;
