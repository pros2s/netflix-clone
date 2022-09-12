import {
  FC,
  Dispatch,
  SetStateAction,
  useState,
  MouseEvent,
  ChangeEvent,
  useCallback,
} from 'react';
import MuiModal from '@mui/material/Modal';

import useAuth from '../hooks/useAuth';

import ErrorMessage from './UI/ErrorMessage';
import Loader from './UI/Loader';
import Input from './UI/Input';

interface DeletePopupProps {
  deletePopup: boolean;
  deleteFunciton: () => Promise<void>;
  setDeletePopup: Dispatch<SetStateAction<boolean>>;
}

const DeletePopup: FC<DeletePopupProps> = ({ deleteFunciton, deletePopup, setDeletePopup }) => {
  const { reAuth, loading } = useAuth();

  const [isReAuth, setIsReAuth] = useState<boolean>(false);
  const [isPasswordCorrect, setIsPasswordCorrect] = useState<boolean>(true);
  const [isValueEmpty, setIsValueEmpty] = useState<boolean>(false);
  const [passwordValue, setPasswordValue] = useState<string>('');

  const confirmCurrentPassword = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();

      if (!passwordValue) {
        setIsValueEmpty(true);
        return;
      }

      await reAuth(passwordValue)
        .then(() => {
          setIsValueEmpty(false);
          setIsReAuth(true);
        })
        .catch((error) => {
          setIsReAuth(false);
          error.message.match(/wrong-password/gi)
            ? setIsPasswordCorrect(false)
            : alert(error.message);
        });
    },
    [passwordValue],
  );

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setIsValueEmpty(false);
    setIsPasswordCorrect(true);
    setPasswordValue(e.target.value);
  };

  return (
    <MuiModal
      className='fixed left-0 right-0 selection:bg-red-600 selection:text-white px-3 z-50 mx-auto w-full max-w-5xl overflow-hidden rounded-2xl scrollbar-hide md:!top-7'
      open={deletePopup}
      onClose={() => setDeletePopup(false)}
    >
      <div className='flex flex-col mx-auto mt-52 max-w-sm bg-[#242424] text-white py-4 px-6 rounded-xl'>
        {isReAuth ? (
          <>
            <h1 className='mb-3 text-xl text-center'>Are you sure?</h1>
            <div className='flex justify-around gap-x-2'>
              <button
                type='button'
                className='py-1 px-2 w-[50%] bg-white/90 transition text-black font-semibold rounded-lg md:hover:bg-white'
                onClick={() => setDeletePopup(false)}
              >
                Save
              </button>
              <button
                type='button'
                className='py-1 px-2 w-[50%] h-8 bg-red-500 transition text-white font-semibold rounded-lg md:hover:bg-red-600'
                onClick={deleteFunciton}
              >
                {loading ? <Loader color='dark:fill-gray-300' height='6' width='35' /> : 'Delete'}
              </button>
            </div>
          </>
        ) : (
          <>
            <form className='relative group'>
              <Input
                isPassword={true}
                placeholder='Password'
                handleChangeInput={handleChangeInput}
                inputValue={passwordValue}
              />

              <ErrorMessage isCheck={!isPasswordCorrect} message='Wrong password. Try again.' />

              <ErrorMessage
                isCheck={isValueEmpty}
                message='Your password must contain between 6 and 60 characters.'
              />

              <button
                type='submit'
                className='mt-3 rounded bg-[#e50914] px-6 py-1.5 font-semibold'
                onClick={confirmCurrentPassword}
              >
                {loading ? <Loader color='dark:fill-gray-300' height='6' width='14' /> : 'Enter'}
              </button>
            </form>
          </>
        )}
      </div>
    </MuiModal>
  );
};

export default DeletePopup;
