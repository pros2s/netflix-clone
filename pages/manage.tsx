import { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { PencilIcon } from '@heroicons/react/outline';
import { TiPlus } from 'react-icons/ti';

import Footer from '../components/UI/Footer';
import MiniHeader from '../components/UI/MiniHeader';
import ManageProfile from '../components/ManageProfile';

import useAuth from '../hooks/useAuth';
import { useProfiles } from '../hooks/useProfiles';
import { useTypedDispatch } from '../hooks/useTypedDispatch';
import { useTypedSelector } from '../hooks/useTypedSelector';

import {
  addingNewProfile,
  profileIsManaging,
  profilesSelector,
  setManagingIcon,
} from '../store/slices/profiles';
import { icons } from '../utils/icons';

const manage: NextPage = () => {
  const dispatch = useTypedDispatch();
  const { isManagingProfile, isAddingProfile } = useTypedSelector(profilesSelector);
  const router = useRouter();

  const { user } = useAuth();
  const profiles = useProfiles(user?.uid);

  const onClickAddNewProfile = () => {
    const rnd = icons[Math.floor(Math.random() * icons.length)].slice(7);
    dispatch(setManagingIcon(rnd));

    dispatch(addingNewProfile());
  };

  if (isManagingProfile || isAddingProfile) return <ManageProfile />;

  return (
    <>
      <Head>
        <title>Manage Profiles</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <MiniHeader isSignOut={true} />

      <main className='relative h-screen flex flex-col items-center px-6'>
        <h1 className='pt-24 font-semibold text-4xl'>Manage Profiles:</h1>

        <div className='flex flex-wrap justify-center items-center gap-x-4 gap-y-10 p-6 max-w-[47rem]'>
          {profiles.map((profile) => (
            <button
              key={Math.random()}
              className='relative h-32 w-32 transition group'
              onClick={() => dispatch(profileIsManaging(profile))}
            >
              <Image
                src={'/icons/' + profile.profileIcon}
                alt={profile.name}
                width={140}
                height={140}
                className='rounded-md opacity-50 transition duration-300 group-hover:opacity-40'
              />

              <div className='bg-black/60 rounded-full p-1.5 absolute top-11 left-12 duration-300 group-hover:bg-black/80 group-hover:scale-110'>
                <PencilIcon className='h-6 w-6' />
              </div>

              <p className='text-md text-white/40 font-light duration-300 group-hover:text-white/80'>
                {profile.name}
              </p>
            </button>
          ))}

          <button
            className={`${
              profiles.length < 5 ? 'flex' : 'hidden'
            } relative flex-col items-center justify-center transition h-32 w-32 group`}
            onClick={onClickAddNewProfile}
          >
            <div className='flex bg-[gray] opacity-60 rounded-full h-16 w-16 duration-300 group-hover:opacity-100'>
              <TiPlus className='h-14 w-14 m-auto text-[#141414] duration-300 group-hover:scale-110' />
            </div>
            <p className='absolute top-full text-md text-white/40 font-light mt-[6px] duration-300 group-hover:text-white/80'>
              add profile
            </p>
          </button>
        </div>

        <button
          className='bg-white text-lg duration-300 font-medium text-[#141414] px-4 py-1 rounded-sm mt-16 md:hover:bg-white/70'
          type='submit'
          onClick={() => router.back()}
        >
          Done
        </button>

        <footer className='md:absolute md:bottom-0 text-center min-w-[191px]'>
          <Footer isAbsolute={true} />
        </footer>
      </main>
    </>
  );
};

export default manage;
