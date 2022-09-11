import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import useAuth from '../../hooks/useAuth';
import { useProfileIcon } from '../../hooks/useProfileIcon';
import { useTypedSelector } from '../../hooks/useTypedSelector';

import { profilesSelector } from '../../store/slices/profiles';

import netflix from '../../assets/netflix.png';

interface MiniHeaderProps {
  isAccount?: boolean;
  isSignOut?: boolean;
}

const MiniHeader: FC<MiniHeaderProps> = ({ isAccount, isSignOut }) => {
  const { currentProfile } = useTypedSelector(profilesSelector);
  const { user, logout } = useAuth();
  const profileIcon = useProfileIcon(user?.uid);

  return (
    <header className='border-b border-white/10 bg-[#141414] pt-3.5 lg:px-16'>
      <Link href='/'>
        <a>
          <Image className='md:cursor-pointer' src={netflix} width={120} height={35} alt='logo' />
        </a>
      </Link>

      {isAccount && (
        <Image
          src={profileIcon || '/icons/yellow'}
          width={35}
          height={35}
          alt={currentProfile}
          className='cursor-pointer rounded'
        />
      )}

      {isSignOut && (
        <button className='text-lg font-medium md:hover:underline' onClick={logout}>
          Sign Out
        </button>
      )}
    </header>
  );
};

export default MiniHeader;
