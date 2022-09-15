import { FC } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import ProfilesList from '../../ProfilesList';
import useAuth from '../../../hooks/useAuth';

const AccountMenu: FC = () => {
  const router = useRouter();
  const { logout } = useAuth();

  return (
    <div className='relative flex flex-col gap-y-2 items-start bg-[#141414] rounded-sm px-3 pt-2 pb-3 border-t border-white/70 shadow-xl accountMenuTriangle'>
      <ProfilesList small={true} />
      <Link href='/manage'>
        <a className='relative mt-2 cursor-pointer h-6 after:absolute after:w-48 after:-left-3 after:top-8 after:border-b after:border-b-[gray]/30 font-medium text-white text-end md:hover:underline'>
          Manage profiles
        </a>
      </Link>
      <Link href='/account'>
        <a
          className='cursor-pointer mt-2 h-6 font-medium text-white text-end md:hover:underline'
          onClick={() => router.push('/account')}
        >
          Account
        </a>
      </Link>
      <button
        type='button'
        className='cursor-pointer -mt-1 h-6 font-medium text-white text-end md:hover:underline'
        onClick={logout}
      >
        Sign out of Netflix
      </button>
    </div>
  );
};

export default AccountMenu;
