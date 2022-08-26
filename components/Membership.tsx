import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react';
import dateFormat from 'dateformat';

import useAuth from '../hooks/useAuth';
import { useTypedDispatch } from '../hooks/useTypedDispatch';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { subscriptionSelector, userUnsubscribed } from '../store/slices/sutbscription';

const Membership: FC = () => {
  const { user } = useAuth();
  const router = useRouter();

  const dispatch = useTypedDispatch();
  const { isSubscription } = useTypedSelector(subscriptionSelector);
  const { startDate } = useTypedSelector(subscriptionSelector);
  const [isPaymentInformation, setIsPaymentInformation] = useState<boolean>(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsPaymentInformation(false);
    }, 3000);

    console.log(isPaymentInformation);
    return () => clearTimeout(timeout);
  }, [isPaymentInformation]);

  const copyDate = startDate;
  let endDate;
  if (copyDate) {
    endDate = dateFormat(new Date(copyDate).setMonth(new Date(copyDate).getMonth() + 1));
  }

  const cancelMembership = () => {
    router.push('/');
    dispatch(userUnsubscribed());
  };

  return (
    <div className='mt-6 grid grid-cols-1 gap-x-4 border px-4 md:grid-cols-4 md:border-x-0 md:border-t md:border-b-0 md:px-0'>
      <div className='space-y-2 py-4'>
        <h4 className='text-lg text-[gray]'>Membership & Billing</h4>
        <button
          disabled={!isSubscription}
          className='h-10 w-3/5 cursor-pointer whitespace-nowrap bg-gray-300 py-2 text-sm font-medium text-black shadow-md hover:bg-gray-200 md:w-4/5'
          onClick={cancelMembership}>
          Cancel Membership
        </button>
      </div>

      <div className='col-span-3'>
        <div className='flex flex-col justify-between border-b border-white/10 py-4 md:flex-row'>
          <div>
            <p className='font-medium'>{user?.email}</p>
            <p className='text-[gray]'>Password: ********</p>
          </div>
          <div className='md:text-right'>
            <p className='membershipLink'>Change email</p>
            <p className='membershipLink'>Change password</p>
          </div>
        </div>

        <div className='flex flex-col justify-between pt-4 pb-4 md:flex-row md:pb-0'>
          <div>
            <p>Your next billing date is {endDate}</p>
            {isPaymentInformation && <p className='text-red-600'>Payment has not integrated yet</p>}
          </div>
          <div className='md:text-right' onClick={() => setIsPaymentInformation(true)}>
            <p className='membershipLink'>Manage payment info</p>
            <p className='membershipLink'>Add backup payment method</p>
            <p className='membershipLink'>Billing Details</p>
            <p className='membershipLink'>Change billing day</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Membership;
