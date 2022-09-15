import { FC, MouseEvent, Dispatch, SetStateAction } from 'react';

import { useTypedDispatch } from '../../hooks/useTypedDispatch';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import useAuth from '../../hooks/useAuth';

import Loader from '../UI/Loader';

import {
  notAddingNewProfile,
  notManagingProfile,
  profilesSelector,
  setCurrentProfile,
  setManagingIcon,
} from '../../store/slices/profiles';

interface ManageBTNsProps {
  inputVal: string;
  isInRange: boolean;
  isExistName: boolean;
  setIsDeleting: Dispatch<SetStateAction<boolean>>;
}

const ManageBTNs: FC<ManageBTNsProps> = ({ inputVal, isInRange, isExistName, setIsDeleting }) => {
  const dispatch = useTypedDispatch();
  const { managingProfile, currentProfile, managingIcon, isAddingProfile } =
    useTypedSelector(profilesSelector);
  const { loading, editProfile, addNewProfile } = useAuth();

  const cancelManaging = () => {
    dispatch(setManagingIcon(''));
    dispatch(notAddingNewProfile());
    dispatch(notManagingProfile());
  };

  const saveChanges = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (isInRange && !isExistName) {
      if (isAddingProfile) {
        await addNewProfile(managingIcon, inputVal);
      } else {
        managingProfile?.name === currentProfile && dispatch(setCurrentProfile(inputVal));

        await editProfile(managingIcon, inputVal, managingProfile);
      }
    }
  };
  return (
    <ul
      className={`flex flex-wrap gap-y-1 items-center w-full ${
        isAddingProfile ? 'gap-x-4' : 'justify-between'
      }`}
    >
      <li className={`${isAddingProfile && 'w-[55%]'}`}>
        <button
          className='manageButton md:hover:text-black md:hover:bg-white w-full'
          type='submit'
          onClick={(e) => saveChanges(e)}
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
            data-text='This is the last profile. You can delete account in account menu'
            type='button'
            onClick={() => setIsDeleting(true)}
          >
            Delete Profile
          </button>
        </li>
      )}
    </ul>
  );
};

export default ManageBTNs;
