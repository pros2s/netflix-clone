import { FC, useRef, useState, ChangeEvent, RefObject, memo } from 'react';
import rndStr from 'randomstring';

interface InputProps {
  isPassword: boolean;
  placeholder: string;
  inputValue: string;
  inputRef?: RefObject<HTMLInputElement>;
  handleChangeInput: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Input: FC<InputProps> = memo(
  ({ isPassword, placeholder, handleChangeInput, inputValue, inputRef }) => {
    const passwordRef = useRef<HTMLInputElement>(null);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const [randomId] = useState<string>(rndStr.generate(5));

    return (
      <>
        <input
          type={!isPassword || showPassword ? 'text' : 'password'}
          id={randomId}
          className='input'
          value={inputValue}
          onChange={(e) => handleChangeInput(e)}
          ref={isPassword ? passwordRef : inputRef}
        />
        <label
          htmlFor={randomId}
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
  },
);

export default Input;
