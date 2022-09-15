import { useState, useEffect } from 'react';

import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';

import { useTypedDispatch } from '../hooks/useTypedDispatch';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { useProfiles } from '../hooks/useProfiles';
import useAuth from '../hooks/useAuth';

import PasswordChanging from '../components/PasswordChanging';
import EmailChanging from '../components/EmailChanging';
import Membership from '../components/Membership';
import Plans from '../components/Plans';
import Footer from '../components/UI/Footer';

import { subscriptionSelector, userIsChangingPlan } from '../store/slices/sutbscription';
import { privateSettingsSelector } from '../store/slices/privateSettings';
import { profilesSelector, setIsWhoIsWatching } from '../store/slices/profiles';

import ProfilesList from '../components/ProfilesList';
import AccountHeader from '../components/accountPage/AccountHeader';

import DeletePopup from '../components/UI/DeletePopup';
import MiniHeader from '../components/UI/MiniHeader';
import Loader from '../components/UI/Loader';
import RowsList from '../components/accountPage/RowsList';

const account: NextPage = () => {
  const router = useRouter();

  const dispatch = useTypedDispatch();
  const { isLoginChanging, isPasswordChanging } = useTypedSelector(privateSettingsSelector);
  const { isChangingPlan } = useTypedSelector(subscriptionSelector);
  const { isWhoIsWatching } = useTypedSelector(profilesSelector);

  const { deleteAccount } = useAuth();

  const [deletePopup, setDeletePopup] = useState<boolean>(false);

  useEffect(() => {
    if (isWhoIsWatching) router.push('/manage');
  }, []);

  if (isLoginChanging) return <EmailChanging />;
  if (isPasswordChanging) return <PasswordChanging />;
  if (isChangingPlan) return <Plans />;

  return (
    <div className='selection:bg-red-600 selection:text-white'>
      <Head>
        <title>Account Settings</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <MiniHeader isAccount={true} />

      <div className='flex flex-col justify-between min-h-screen'>
        <main className='mx-auto max-w-6xl px-5 pt-24 pb-12 transition-all md:px-10'>
          <AccountHeader />

          <Membership />

          <RowsList setDeletePopup={setDeletePopup} />
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
