import { useState, useEffect } from 'react';

import { NextPage } from 'next';
import { useRouter } from 'next/router';
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
import ManageProfile from '../components/ManageProfile';
import Footer from '../components/UI/Footer';

import { subscriptionSelector, userIsChangingPlan } from '../store/slices/sutbscription';
import { privateSettingsSelector } from '../store/slices/privateSettings';
import { profileIsManaging, profilesSelector, setIsWhoIsWatching } from '../store/slices/profiles';

import membersince from '../assets/membersince.png';
import DeletePopup from '../components/DeletePopup';
import MiniHeader from '../components/UI/MiniHeader';
import Loader from '../components/UI/Loader';

const account: NextPage = () => {
  const router = useRouter();

  const dispatch = useTypedDispatch();
  const { isLoginChanging, isPasswordChanging } = useTypedSelector(privateSettingsSelector);
  const { startDate, plan, isChangingPlan } = useTypedSelector(subscriptionSelector);
  const { isManagingProfile, currentProfile, isWhoIsWatching } = useTypedSelector(profilesSelector);

  const { logout, user, loading, deleteAccount } = useAuth();
  const profiles = useProfiles(user?.uid);

  const [deletePopup, setDeletePopup] = useState<boolean>(false);

  useEffect(() => {
    if (isWhoIsWatching) router.push('/manage');
  }, []);

  const formatDate = dateFormat(startDate!);

  const whoIsWatchingHangler = () => {
    router.push('/manage');
    dispatch(setIsWhoIsWatching());
  };

  if (isLoginChanging) return <EmailChanging />;
  if (isPasswordChanging) return <PasswordChanging />;
  if (isChangingPlan) return <Plans />;
  if (isManagingProfile) return <ManageProfile />;

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
              {loading ? (
                <Loader color='dark:fill-gray-300' height='8' width='8' />
              ) : (
                <p className='text-xs font-semibold text-[#555]'>Member since {formatDate}</p>
              )}
            </div>
          </div>

          <Membership />

          <div className='accountRow'>
            <h4 className='uppercase text-lg text-[gray]'>Plan Details</h4>
            <p className='col-span-2 font-medium text-left'>
              {loading ? <Loader color='dark:fill-gray-300' height='8' width='8' /> : plan?.name}
            </p>
            <button
              className='text-end cursor-pointer text-blue-500 md:hover:underline md:text-right'
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
            {loading ? (
              <Loader color='dark:fill-gray-300' height='8' width='8' />
            ) : (
              <div className='col-span-2 space-y-2'>
                {profiles.map((profile) => (
                  <div key={profile.name} className='col-span-2 flex justify-between text-lg'>
                    <div className='flex items-center gap-x-4'>
                      <Image
                        src={'/icons/' + profile.profileIcon}
                        alt={profile.name}
                        width={40}
                        height={40}
                        className='rounded-md'
                      />
                      <div>
                        <div className='flex gap-x-4'>
                          <p className='leading-5'>
                            {profile.name}
                          </p>
                          {profiles.length > 1 && (
                            <p className='leading-5 text-green-500'>
                              {currentProfile === profile.name && 'current'}
                            </p>
                          )}
                        </div>
                        <button
                          className='cursor-pointer text-blue-500 md:hover:underline md:text-right text-md'
                          onClick={() => dispatch(profileIsManaging(profile))}
                        >
                          edit
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className='flex flex-col'>
              {profiles.length > 1 && (
                <button
                  className='cursor-pointer h-6 text-blue-500 md:hover:underline text-end'
                  onClick={whoIsWatchingHangler}
                >
                  Who is watching?
                </button>
              )}
              <button
                className='cursor-pointer h-6 text-blue-500 md:hover:underline text-end'
                onClick={() => router.push('/manage')}
              >
                Manage profiles
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>

      {deletePopup && (
        <DeletePopup
          deleteFunciton={deleteAccount}
          deletePopup={deletePopup}
          setDeletePopup={setDeletePopup}
        />
      )}
    </div>
  );
};

export default account;
