import { FC, useState, useEffect } from 'react';
import { PencilIcon } from '@heroicons/react/outline';
import Head from 'next/head';
import Image from 'next/image';

import { deleteDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

import { useTypedSelector } from '../hooks/useTypedSelector';
import { useTypedDispatch } from '../hooks/useTypedDispatch';
import { useProfiles } from '../hooks/useProfiles';
import useAuth from '../hooks/useAuth';

import {
  choosingIcon,
  notEditingProfile,
  profilesSelector,
  setCurrentProfile,
  setEditingIcon,
} from '../store/slices/profiles';

import Footer from './UI/Footer';
import ErrorMessage from './UI/ErrorMessage';
import MiniHeader from './UI/MiniHeader';
import ChosingIcon from './ChosingIcon';
import Loader from './UI/Loader';

const EditProfile: FC = () => {
  const { editingProfile, currentProfile, editingIcon, choosing } =
    useTypedSelector(profilesSelector);
  const dispatch = useTypedDispatch();
  const { user, loading, deleteProfileLoading, editProfile, deleteProfile } = useAuth();
  const profiles = useProfiles(user?.uid);

  const [inputVal, setInputVal] = useState<string>(editingProfile.name);
  const [isExistName, setIsExistName] = useState<boolean>(false);
  const [isInRange, setIsInRange] = useState<boolean>(true);

  useEffect(() => {
    profiles.filter((profile) => profile.name === inputVal && profile.name !== editingProfile.name)
      .length === 0
      ? setIsExistName(false)
      : setIsExistName(true);
    inputVal.length > 1 && inputVal.length < 21 ? setIsInRange(true) : setIsInRange(false);
  }, [inputVal]);

  const cancelEditing = () => {
    dispatch(setEditingIcon(''));
    dispatch(notEditingProfile({ name: '', profileIcon: '' }));
  };

  const saveChanges = async () => {
    if (isInRange && !isExistName) {
      editingProfile.name === currentProfile && dispatch(setCurrentProfile(inputVal));

      await editProfile(editingIcon, inputVal);
    }
  };

  const deleteProf = async () => {
    await deleteProfile();

    dispatch(notEditingProfile({ name: '', profileIcon: '' }));
  };

  if (choosing) return <ChosingIcon isEditing={true} />;

  return (
    <div className='selection:bg-red-600 selection:text-white'>
      <Head>
        <title>Edit profile</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <MiniHeader isSignOut={true} />

      <main className='flex flex-col space-y-4 items-center m-auto mb-2.5 pt-20 max-w-xs'>
        <h1 className='text-3xl pb-3 border-b border-white/10 md:text-5xl'>Edit Profile</h1>

        <div className='relative'>
          <Image
            src={editingIcon || '/icons/' + editingProfile.profileIcon}
            alt={editingProfile.name}
            width={320}
            height={320}
            className='rounded-md'
          />

          <button
            className='bg-black rounded-full p-1.5 absolute top-1 right-1 shadow-2xl group'
            onClick={() => dispatch(choosingIcon())}
          >
            <PencilIcon className='h-6 w-6 transition group-hover:scale-110' />
          </button>
        </div>

        <div className='relative group w-full'>
          <input
            className='input'
            type='text'
            id='newUsername'
            value={inputVal}
            onChange={({ target }) => setInputVal(target.value)}
          />

          <label
            htmlFor='newUsername'
            className={`placeholder ${inputVal ? 'placeholderIn' : 'placeholderOut'}`}
          >
            Your new name
          </label>

          <ErrorMessage
            isCheck={isExistName}
            message={`Profile with name ${inputVal} already exists.`}
          />

          <ErrorMessage
            isCheck={!isInRange}
            message='Profile name must contain between 2 and 20 characters.'
          />
        </div>

        <ul className='flex flex-wrap gap-y-1 items-center w-full justify-between'>
          <li>
            <button
              className='editButton md:hover:text-black md:hover:bg-white'
              type='button'
              onClick={saveChanges}
            >
              {loading ? <Loader color='dark:fill-gray-300' height='6' width='8' /> : 'Save'}
            </button>
          </li>
          <li>
            <button
              className='editButton md:hover:border-white md:hover:text-white'
              type='button'
              onClick={cancelEditing}
            >
              Cancel
            </button>
          </li>
          <li>
            <button
              className='editButton deleteProfileButton'
              data-text='This is the last profile in account. You can delete account in account menu'
              type='button'
              disabled={profiles.length === 1 ? true : false}
              onClick={deleteProf}
            >
              {deleteProfileLoading ? (
                <Loader color='dark:fill-gray-300' height='6' width='8' />
              ) : (
                'Delete Profile'
              )}
            </button>
          </li>
        </ul>
      </main>

      <Footer />
    </div>
  );
};

export default EditProfile;
