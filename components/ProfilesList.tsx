import { FC } from 'react';
import Image from 'next/image';
import { DocumentData } from 'firebase/firestore';
import { useRouter } from 'next/router';

import useAuth from '../hooks/useAuth';
import { useProfiles } from '../hooks/useProfiles';
import { useTypedDispatch } from '../hooks/useTypedDispatch';
import { useTypedSelector } from '../hooks/useTypedSelector';

import { profileIsManaging, profilesSelector } from '../store/slices/profiles';
import { Profile } from '../types';

interface ProfilesListProps {
  small?: boolean;
}

const ProfilesList: FC<ProfilesListProps> = ({ small }) => {
  const dispatch = useTypedDispatch();
  const { currentProfile } = useTypedSelector(profilesSelector);

  const router = useRouter();
  const { user } = useAuth();
  const profiles = useProfiles(user?.uid);

  const editProfile = (profile: DocumentData | Profile) => {
    router.push('/manage');
    dispatch(profileIsManaging(profile));
  };

  return (
    <>
      {profiles.map((profile) => (
        <div
          key={profile.name}
          className={`col-span-2 flex justify-between ${
            small ? 'text-sm cursor-pointer' : 'text-lg'
          } ${small && profile.name === currentProfile && 'hidden'}`}
        >
          <div className='flex items-center gap-x-4'>
            <Image
              src={'/icons/' + profile.profileIcon}
              alt={profile.name}
              width={small ? 33 : 40}
              height={small ? 33 : 40}
              className={`${small ? 'rounded-sm' : 'rounded-md'}`}
            />
            <div className={`${small && 'flex flex-col items-start'}`}>
              <div className='flex gap-x-4'>
                <p
                  className={` leading-6 first-letter:capitalize overflow-hidden whitespace-nowrap text-ellipsis ${
                    small && 'w-[103px] font-medium'
                  }`}
                >
                  {profile.name}
                </p>

                {profiles.length > 1 && (
                  <p className='leading-5 text-green-500'>
                    {currentProfile === profile.name && !small && 'current'}
                  </p>
                )}
              </div>
              <button
                className='cursor-pointer text-blue-500 md:hover:underline md:text-right text-md'
                onClick={() => editProfile(profile)}
              >
                edit
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default ProfilesList;
