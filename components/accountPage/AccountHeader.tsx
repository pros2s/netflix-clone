import { FC } from 'react';
import Image from 'next/image';
import dateFormat from 'dateformat';

import useAuth from '../../hooks/useAuth';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { subscriptionSelector } from '../../store/slices/sutbscription';

import Loader from '../UI/Loader';
import membersince from '../../assets/membersince.png';

const AccountHeader: FC = () => {
  const { startDate } = useTypedSelector(subscriptionSelector);
  const formatDate = dateFormat(startDate!);

  const { loading } = useAuth();

  return (
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
  );
};

export default AccountHeader;
