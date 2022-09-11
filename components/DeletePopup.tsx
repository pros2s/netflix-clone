import {
  FC,
  Dispatch,
  SetStateAction,
  useState,
  MouseEvent,
  ChangeEvent,
  useCallback,
  useRef,
} from 'react';
import MuiModal from '@mui/material/Modal';

import useAuth from '../hooks/useAuth';

import ErrorMessage from './UI/ErrorMessage';
import Loader from './UI/Loader';

interface DeletePopupProps {
  deletePopup: boolean;
  setDeletePopup: Dispatch<SetStateAction<boolean>>;
}

const DeletePopup: FC<DeletePopupProps> = ({ deletePopup, setDeletePopup }) => {
  const { deleteAccount, reAuth, loading } = useAuth();
  const passwordRef = useRef<HTMLInputElement>(null);

  const [isReAuth, setIsReAuth] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isPasswordCorrect, setIsPasswordCorrect] = useState<boolean>(true);
  const [passwordValue, setPasswordValue] = useState<string>('');

  const confirmCurrentPassword = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();

      await reAuth(passwordValue)
        .then(() => setIsReAuth(true))
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
            <h1 className='mb-3 text-xl text-center'>Are you sure you want to delete account?</h1>
            <div className='flex justify-around gap-x-2'>
              <button
                type='button'
                className='py-1 px-2 bg-white/90 transition text-black font-semibold rounded-lg md:hover:bg-white'
                onClick={() => setDeletePopup(false)}
              >
                Save account
              </button>
              <button
                type='button'
                className='py-1 px-2 w-40 bg-red-500 transition text-white font-semibold rounded-lg md:hover:bg-red-600'
                onClick={deleteAccount}
              >
                {loading ? <Loader color='dark:fill-gray-300' /> : 'Delete account'}
              </button>
            </div>
          </>
        ) : (
          <>
            <form className='relative group'>
              <input
                type={showPassword ? 'text' : 'password'}
                id='passwordInput'
                className='input'
                value={passwordValue}
                onChange={(e) => handleChangeInput(e)}
                ref={passwordRef}
              />
              <label
                htmlFor='passwordInput'
                className={`placeholder ${passwordValue ? 'placeholderIn' : 'placeholderOut'}`}
              >
                Password
              </label>

              <button
                type='button'
                className='opacity-0 pointer-events-none transition-opacity absolute top-3 right-3 text-[darkgray] uppercase group-focus-within:opacity-100 group-focus-within:pointer-events-auto'
                onClick={() => {
                  passwordRef.current?.click();
                  setShowPassword((state) => !state);
                }}
              >
                {showPassword ? 'hide' : 'show'}
              </button>

              <ErrorMessage isCheck={!isPasswordCorrect} message='Wrong password. Try again.' />

              <button
                type='submit'
                className='mt-3 rounded bg-[#e50914] px-6 py-1.5 font-semibold'
                onClick={confirmCurrentPassword}
              >
                {loading ? <Loader color='dark:fill-gray-300' /> : 'Enter'}
              </button>
            </form>
          </>
        )}
      </div>
    </MuiModal>
  );
};

export default DeletePopup;
