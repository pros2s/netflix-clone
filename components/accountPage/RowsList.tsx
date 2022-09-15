import { FC, Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/router';

import useAuth from '../../hooks/useAuth';
import { useProfiles } from '../../hooks/useProfiles';
import { useTypedDispatch } from '../../hooks/useTypedDispatch';
import { useTypedSelector } from '../../hooks/useTypedSelector';

import { setIsWhoIsWatching } from '../../store/slices/profiles';
import { subscriptionSelector, userIsChangingPlan } from '../../store/slices/sutbscription';

import ProfilesList from '../ProfilesList';
import Loader from '../UI/Loader';

interface RowsListProps {
  setDeletePopup: Dispatch<SetStateAction<boolean>>;
}

const RowsList: FC<RowsListProps> = ({ setDeletePopup }) => {
  const dispatch = useTypedDispatch();
  const { plan } = useTypedSelector(subscriptionSelector);

  const router = useRouter();
  const { logout, user, loading } = useAuth();
  const profiles = useProfiles(user?.uid);

  const whoIsWatchingHangler = () => {
    router.push('/manage');
    dispatch(setIsWhoIsWatching());
  };

  return (
    <ul>
      <li className='accountRow'>
        <h4 className='uppercase text-lg text-[gray]'>Plan Details</h4>
        <p className='col-span-2 font-medium text-left'>
          {loading ? <Loader color='dark:fill-gray-300' height='8' width='8' /> : plan?.name}
        </p>
        <button
          className='text-end cursor-pointer text-blue-500 md:hover:underline md:text-right'
          onClick={() => dispatch(userIsChangingPlan())}
        >
          Change plan
        </button>
      </li>

      <li className='accountRow'>
        <h4 className='uppercase text-lg text-[gray]'>Settings</h4>
        <button
          className='text-start col-span-2 cursor-pointer text-blue-500 md:hover:underline'
          onClick={logout}
        >
          Sign out of all devices
        </button>
        <button
          className='text-end cursor-pointer text-red-600 md:hover:underline'
          onClick={() => setDeletePopup(true)}
        >
          Delete Account
        </button>
      </li>

      <li className='accountRow'>
        <h4 className='uppercase text-lg text-[gray]'>Profiles</h4>
        {loading ? (
          <Loader color='dark:fill-gray-300' height='8' width='8' />
        ) : (
          <div className='col-span-2 space-y-2'>
            <ProfilesList />
          </div>
        )}

        <div className='flex flex-col'>
          {profiles.length > 1 && (
            <button
              className='cursor-pointer h-6 text-blue-500 md:hover:underline text-end'
              onClick={whoIsWatchingHangler}
            >
              Who is watching?
            </button>
          )}
          <button
            className='cursor-pointer h-6 text-blue-500 md:hover:underline text-end'
            onClick={() => router.push('/manage')}
          >
            Manage profiles
          </button>
        </div>
      </li>
    </ul>
  );
};

export default RowsList;
