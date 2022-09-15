import { MouseEvent, useCallback, ChangeEvent, useState } from 'react';
import useAuth from './useAuth';

export const useConfirmPassword = () => {
  const { reAuth } = useAuth();

  const [isReAuth, setIsReAuth] = useState<boolean>(false);
  const [isPasswordCorrect, setIsPasswordCorrect] = useState<boolean>(true);
  const [isValueEmpty, setIsValueEmpty] = useState<boolean>(false);
  const [passwordValue, setPasswordValue] = useState<string>('');

  const confirmPassword = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();

      if (!passwordValue) {
        setIsValueEmpty(true);
        return;
      }

      await reAuth(passwordValue)
        .then(() => {
          setIsReAuth(true);
          setIsValueEmpty(false);
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

  const handleChangeInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setIsValueEmpty(false);
      setIsPasswordCorrect(true);
      setPasswordValue(e.target.value);
    },
    [passwordValue],
  );

  return {
    confirmPassword,
    handleChangeInput,
    passwordValue,
    isReAuth,
    isPasswordCorrect,
    isValueEmpty,
  };
};
