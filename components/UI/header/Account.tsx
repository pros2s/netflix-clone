import { FC, useState } from 'react';
import Image from 'next/image';

import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { useProfileIcon } from '../../../hooks/useProfileIcon';
import useAuth from '../../../hooks/useAuth';

import { profilesSelector } from '../../../store/slices/profiles';
import AccountMenu from './AccountMenu';

const Account: FC = () => {
  const { user } = useAuth();
  const { currentProfile } = useTypedSelector(profilesSelector);
  const profileIcon = useProfileIcon(user?.uid);
  const [toggleAccountMenu, setToggleAccountMenu] = useState<boolean>(false);
  return (
    <div
      className={`relative h-[35px] accountButtonTriangle ${
        toggleAccountMenu && 'after:rotate-180'
      }`}
      onClick={() => setToggleAccountMenu((state) => !state)}
    >
      <Image
        src={profileIcon || '/icons/yellow'}
        height={35}
        width={35}
        alt={currentProfile}
        className='cursor-pointer rounded'
      />

      {toggleAccountMenu && (
        <div className='absolute top-[52px] -left-[8.5rem] w-48'>
          <AccountMenu />
        </div>
      )}
    </div>
  );
};

export default Account;
