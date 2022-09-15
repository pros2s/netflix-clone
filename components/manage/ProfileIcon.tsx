import { FC } from 'react';
import Image from 'next/image';
import { PencilIcon } from '@heroicons/react/outline';

import { useTypedDispatch } from '../../hooks/useTypedDispatch';
import { useTypedSelector } from '../../hooks/useTypedSelector';

import { choosingIcon, profilesSelector } from '../../store/slices/profiles';

const ProfileIcon: FC = () => {
  const dispatch = useTypedDispatch();
  const { managingProfile, currentProfile, managingIcon, isAddingProfile } =
    useTypedSelector(profilesSelector);

  return (
    <div className='relative'>
      <Image
        src={managingIcon ? '/icons/' + managingIcon : '/icons/' + managingProfile.profileIcon}
        alt={isAddingProfile ? 'Adding icon' : managingProfile?.name}
        width={320}
        height={320}
        className='rounded-md'
      />
      {currentProfile === managingProfile?.name && (
        <p className='absolute top-1 left-1 text-2xl shadow-2xl text-shadow-md text-white/60 bg-[#141414]/30 rounded-md py-0.5 px-1.5 transition md:hover:text-white md:hover:bg-[#141414]/70'>
          current
        </p>
      )}

      <button
        type='button'
        className='bg-[#141414]/30 rounded-full p-1.5 absolute top-1 right-1 shadow-2xl transition md:hover:bg-[#141414] group'
        onClick={() => dispatch(choosingIcon())}
      >
        <PencilIcon className='h-6 w-6 transition text-white/60 group-hover:scale-110 group-hover:text-white' />
      </button>
    </div>
  );
};

export default ProfileIcon;
