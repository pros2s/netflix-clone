import { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { PencilIcon } from '@heroicons/react/outline';

import Footer from '../components/UI/Footer';
import MiniHeader from '../components/UI/MiniHeader';

import useAuth from '../hooks/useAuth';
import { useProfiles } from '../hooks/useProfiles';
import EditProfile from '../components/EditProfile';
import { useTypedDispatch } from '../hooks/useTypedDispatch';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { profileIsEditing, profilesSelector } from '../store/slices/profiles';

const manage: NextPage = () => {
  const dispatch = useTypedDispatch();
  const { isEditingProfile } = useTypedSelector(profilesSelector);

  const { user } = useAuth();
  const profiles = useProfiles(user?.uid);

  if (isEditingProfile) return <EditProfile />;

  return (
    <>
      <Head>
        <title>Manage Profiles</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <MiniHeader isSignOut={true} />

      <main className='relative h-screen flex flex-col items-center px-6'>
        <h1 className='pt-24 text-2xl font-semibold md:text-3xl lg:text-4xl'>Manage Profiles:</h1>

        <div className='flex flex-wrap justify-center items-center gap-1 md:gap-2 lg:gap-4 p-6 max-w-[38rem]'>
          {profiles.map((profile) => (
            <button
              key={Math.random()}
              className='relative h-16 w-16 transition md:h-24 md:w-24 lg:h-32 lg:w-32 group'
              onClick={() => dispatch(profileIsEditing(profile))}
            >
              <Image
                src={'/icons/' + profile.profileIcon}
                alt={profile.name}
                width={140}
                height={140}
                className='rounded-md opacity-50 transition duration-300 group-hover:opacity-40'
              />

              <button className='bg-black/60 rounded-full p-1.5 absolute top-11 left-12 duration-300 group-hover:bg-black/80 group-hover:scale-110'>
                <PencilIcon className='h-6 w-6' />
              </button>

              <p className='text-2xl'>{profile.name}</p>
            </button>
          ))}
        </div>

        <Footer isAbsolute={true} />
      </main>
    </>
  );
};

export default manage;
