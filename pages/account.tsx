import { useState } from 'react';

import { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import dateFormat from 'dateformat';

import { useTypedDispatch } from '../hooks/useTypedDispatch';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { useProfiles } from '../hooks/useProfiles';
import useAuth from '../hooks/useAuth';

import PasswordChanging from '../components/PasswordChanging';
import EmailChanging from '../components/EmailChanging';
import Membership from '../components/Membership';
import Plans from '../components/Plans';
import EditProfile from '../components/EditProfile';
import Footer from '../components/UI/Footer';

import { subscriptionSelector, userIsChangingPlan } from '../store/slices/sutbscription';
import { privateSettingsSelector } from '../store/slices/privateSettings';
import { editingProfile, profilesSelector } from '../store/slices/profiles';

import membersince from '../assets/membersince.png';
import DeletePopup from '../components/DeletePopup';
import MiniHeader from '../components/UI/MiniHeader';

const account: NextPage = () => {
  const dispatch = useTypedDispatch();
  const { isLoginChanging, isPasswordChanging } = useTypedSelector(privateSettingsSelector);
  const { startDate, plan, isChangingPlan } = useTypedSelector(subscriptionSelector);
  const { isEditingProfile } = useTypedSelector(profilesSelector);

  const { logout, user } = useAuth();
  const profiles = useProfiles(user?.uid);

  const [deletePopup, setDeletePopup] = useState<boolean>(false);

  const formatDate = dateFormat(startDate!);

  if (isLoginChanging) return <EmailChanging />;
  if (isPasswordChanging) return <PasswordChanging />;
  if (isChangingPlan) return <Plans />;
  if (isEditingProfile) return <EditProfile />;

  return (
    <div className='selection:bg-red-600 selection:text-white'>
      <Head>
        <title>Account Settings</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <MiniHeader isAccount={true} />

      <div className='flex flex-col justify-between min-h-screen'>
        <main className='mx-auto max-w-6xl px-5 pt-24 pb-12 transition-all md:px-10'>
          <div className='flex flex-col gap-x-4 md:flex-row md:items-center'>
            <h1 className='text-3xl md:text-4xl'>Account</h1>
            <div className='-ml-0.5 flex items-center gap-x-1.5'>
              <Image src={membersince} alt='membersince' width={28} height={28} />
              <p className='text-xs font-semibold text-[#555]'>Member since {formatDate}</p>
            </div>
          </div>

          <Membership />

          <div className='accountRow'>
            <h4 className='uppercase text-lg text-[gray]'>Plan Details</h4>
            <p className='col-span-2 font-medium'>{plan?.name}</p>
            <button
              className='cursor-pointer text-blue-500 md:hover:underline md:text-right'
              onClick={() => dispatch(userIsChangingPlan())}
            >
              Change plan
            </button>
          </div>

          <div className='accountRow'>
            <h4 className='uppercase text-lg text-[gray]'>Settings</h4>
            <button
              className='text-start col-span-2 cursor-pointer text-blue-500 md:hover:underline'
              onClick={logout}
            >
              Sign out of all devices
            </button>
            <button
              className='text-end cursor-pointer text-red-600 md:hover:underline'
              onClick={() => setDeletePopup(true)}
            >
              Delete Account
            </button>
          </div>

          <div className='accountRow'>
            <h4 className='uppercase text-lg text-[gray]'>Profiles</h4>
            {profiles.map((profile) => (
              <div key={profile.name} className='col-span-3 flex justify-between text-lg'>
                <div className='flex items-center gap-x-4'>
                  <Image
                    src={'/icons/' + profile.profileIcon}
                    alt={profile.name}
                    width={40}
                    height={40}
                    className='rounded-md'
                  />
                  <p>{profile.name}</p>
                </div>
                <button
                  className='cursor-pointer text-blue-500 md:hover:underline md:text-right'
                  onClick={() => dispatch(editingProfile(profile))}
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        </main>
        <Footer />
      </div>

      {deletePopup && <DeletePopup deletePopup={deletePopup} setDeletePopup={setDeletePopup} />}
    </div>
  );
};

export default account;
