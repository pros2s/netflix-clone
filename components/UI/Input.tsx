import { FC, useRef, useState, ChangeEvent, RefObject } from 'react';

interface InputProps {
  isPassword: boolean;
  placeholder: string;
  inputValue: string;
  inputRef?: RefObject<HTMLInputElement>;
  handleChangeInput: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Input: FC<InputProps> = ({
  isPassword,
  placeholder,
  handleChangeInput,
  inputValue,
  inputRef,
}) => {
  const passwordRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <>
      <input
        type={!isPassword || showPassword ? 'text' : 'password'}
        id='input'
        className='input'
        value={inputValue}
        onChange={(e) => handleChangeInput(e)}
        ref={isPassword ? passwordRef : inputRef}
      />
      <label
        htmlFor='input'
        className={`placeholder ${inputValue ? 'placeholderIn' : 'placeholderOut'}`}
      >
        {placeholder}
      </label>

      {isPassword && (
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
      )}
    </>
  );
};

export default Input;
