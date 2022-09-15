import { FC, useState, useEffect, ChangeEvent, useRef } from 'react';
import Head from 'next/head';

import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useProfiles } from '../../hooks/useProfiles';
import useAuth from '../../hooks/useAuth';

import { profilesSelector } from '../../store/slices/profiles';

import Footer from '../UI/Footer';
import ErrorMessage from '../UI/ErrorMessage';
import MiniHeader from '../UI/MiniHeader';
import ChosingIcon from '../ChosingIcon';
import Input from '../UI/Input';
import DeletePopup from '../UI/DeletePopup';

import ProfileIcon from './ProfileIcon';
import ManageBTNs from './ManageBTNs';

const ManageProfile: FC = () => {
  const { managingProfile, isChoosing, isAddingProfile } = useTypedSelector(profilesSelector);
  const { user, deleteProfile } = useAuth();
  const profiles = useProfiles(user?.uid);

  const inputRef = useRef<HTMLInputElement>(null);

  const [inputVal, setInputVal] = useState<string>(isAddingProfile ? '' : managingProfile?.name);
  const [isExistName, setIsExistName] = useState<boolean>(false);
  const [isInRange, setIsInRange] = useState<boolean>(true);

  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    inputValidate();
  }, [inputVal]);

  const inputValidate = () => {
    profiles.find((profile) => profile?.name === inputVal)
      ? setIsExistName(true)
      : setIsExistName(false);

    inputVal.length > 1 && inputVal.length < 21 ? setIsInRange(true) : setIsInRange(false);
  };

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setInputVal(e.target.value);
  };

  if (isChoosing) return <ChosingIcon isManage={true} />;

  return (
    <div className='selection:bg-red-600 selection:text-white'>
      <Head>
        <title>{isAddingProfile ? 'Add new profile' : 'Edit profile'}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <MiniHeader isSignOut={true} />

      <form className='flex flex-col space-y-4 items-center m-auto pt-20 max-w-xs'>
        <h1 className='border-b border-white/10 text-3xl md:text-[40px] pb-3'>
          {isAddingProfile ? 'Add new profile' : 'Edit profile'}
        </h1>

        <ProfileIcon />

        <div className='relative group w-full'>
          <Input
            inputRef={inputRef}
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

        <ManageBTNs
          inputVal={inputVal}
          isExistName={isExistName}
          isInRange={isInRange}
          setIsDeleting={setIsDeleting}
        />

        <footer className='absolute bottom-0'>
          <Footer />
        </footer>
      </form>

      {isDeleting && (
        <DeletePopup
          deleteFunciton={() => deleteProfile(managingProfile?.name)}
          deletePopup={isDeleting}
          setDeletePopup={setIsDeleting}
        />
      )}
    </div>
  );
};

export default ManageProfile;
