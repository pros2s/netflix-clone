import { FC, useState, useEffect, ChangeEvent, useMemo } from 'react';
import { PencilIcon } from '@heroicons/react/outline';
import Head from 'next/head';
import Image from 'next/image';

import { useTypedSelector } from '../hooks/useTypedSelector';
import { useTypedDispatch } from '../hooks/useTypedDispatch';
import { useProfiles } from '../hooks/useProfiles';
import useAuth from '../hooks/useAuth';

import {
  choosingIcon,
  notAddingNewProfile,
  notManagingProfile,
  profilesSelector,
  setCurrentProfile,
  setManagingIcon,
} from '../store/slices/profiles';

import Footer from './UI/Footer';
import ErrorMessage from './UI/ErrorMessage';
import MiniHeader from './UI/MiniHeader';
import ChosingIcon from './ChosingIcon';
import Loader from './UI/Loader';
import Input from './UI/Input';

const ManageProfile: FC = () => {
  const { managingProfile, currentProfile, managingIcon, choosing, isAddingProfile } =
    useTypedSelector(profilesSelector);
  const dispatch = useTypedDispatch();
  const { user, loading, deleteProfileLoading, editProfile, addNewProfile, deleteProfile } =
    useAuth();
  const profiles = useProfiles(user?.uid);

  const [inputVal, setInputVal] = useState<string>(
    isAddingProfile ? 'New profile' : managingProfile.name,
  );
  const [isExistName, setIsExistName] = useState<boolean>(false);
  const [isInRange, setIsInRange] = useState<boolean>(true);

  useEffect(() => {
    inputValidate();
  }, [inputVal]);

  console.log(managingIcon);

  const inputValidate = () => {
    profiles.find((profile) => profile.name === inputVal)
      ? setIsExistName(true)
      : setIsExistName(false);

    inputVal.length > 1 && inputVal.length < 21 ? setIsInRange(true) : setIsInRange(false);
  };

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setInputVal(e.target.value);
  };

  const cancelManaging = () => {
    dispatch(setManagingIcon(''));
    dispatch(notAddingNewProfile());
    dispatch(notManagingProfile());
  };

  const saveChanges = async () => {
    if (isInRange && !isExistName) {
      if (isAddingProfile) {
        await addNewProfile(managingIcon, inputVal);
      } else {
        managingProfile.name === currentProfile && dispatch(setCurrentProfile(inputVal));

        await editProfile(managingIcon, inputVal, managingProfile);
      }
    }
  };

  const deleteProf = async () => {
    await deleteProfile(managingProfile.name);

    dispatch(notManagingProfile());
  };

  if (choosing) return <ChosingIcon isManage={true} />;

  return (
    <div className='selection:bg-red-600 selection:text-white'>
      <Head>
        <title>{isAddingProfile ? 'Add new profile' : 'Edit profile'}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <MiniHeader isSignOut={true} />

      <main className='flex flex-col space-y-4 items-center m-auto pt-20 max-w-xs'>
        <h1 className='border-b border-white/10 text-3xl md:text-[40px] pb-3'>
          {isAddingProfile ? 'Add new profile' : 'Edit profile'}
        </h1>

        <div className='relative'>
          <Image
            src={managingIcon ? '/icons/' + managingIcon : '/icons/' + managingProfile.profileIcon}
            alt={isAddingProfile ? 'Adding icon' : managingProfile.name}
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
          <Input
            handleChangeInput={handleChangeInput}
            inputValue={inputVal}
            isPassword={false}
            placeholder={isAddingProfile ? 'Name' : 'Your new name'}
          />

          <ErrorMessage
            isCheck={isExistName}
            message={`Profile with name ${inputVal} already exists.`}
          />

          <ErrorMessage
            isCheck={!isInRange}
            message='Profile name must contain between 2 and 20 characters.'
          />
        </div>

        <ul
          className={`flex flex-wrap gap-y-1 items-center w-full ${
            isAddingProfile ? 'gap-x-4' : 'justify-between'
          }`}
        >
          <li className={`${isAddingProfile && 'w-[55%]'}`}>
            <button
              className='manageButton md:hover:text-black md:hover:bg-white w-full'
              type='button'
              onClick={saveChanges}
            >
              {loading ? (
                <Loader color='dark:fill-gray-300' height='6' width='8' />
              ) : isAddingProfile ? (
                'Add profile'
              ) : (
                'Save'
              )}
            </button>
          </li>
          <li className={`${isAddingProfile && 'w-[40%]'}`}>
            <button
              className='manageButton md:hover:border-white md:hover:text-white w-full'
              type='button'
              onClick={cancelManaging}
            >
              Cancel
            </button>
          </li>
          {!isAddingProfile && (
            <li>
              <button
                className='manageButton deleteProfileButton'
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
          )}
        </ul>

        <footer className='absolute bottom-0'>
          <Footer />
        </footer>
      </main>
    </div>
  );
};

export default ManageProfile;
