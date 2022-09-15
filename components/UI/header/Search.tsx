import { FC, useEffect, useState, useRef } from 'react';

import { SearchIcon } from '@heroicons/react/solid';
import { XIcon } from '@heroicons/react/outline';
import { useTypedDispatch } from '../../../hooks/useTypedDispatch';
import { searchSelector, setSearchValue } from '../../../store/slices/search';
import { useTypedSelector } from '../../../hooks/useTypedSelector';

const Search: FC = () => {
  const dispatch = useTypedDispatch();
  const { searchValue } = useTypedSelector(searchSelector);
  const inputRef = useRef<HTMLInputElement>(null);

  const [toggleSearch, setToggleSearch] = useState<boolean>(false);

  let toggleSearchTimeout: ReturnType<typeof setTimeout>;
  const clearInput = () => {
    dispatch(setSearchValue(''));
    toggleSearchTimeout = setTimeout(() => {
      setToggleSearch(false);
    }, 50);
  };
  useEffect(() => clearTimeout(toggleSearchTimeout), []);

  const searchClickHandler = () => {
    inputRef.current?.focus();
    setToggleSearch((state) => !state);
  };

  return (
    <div className={`hidden sm:flex items-center ${toggleSearch && 'gap-x-3'}`}>
      <button onClick={searchClickHandler}>
        <SearchIcon className='w-6 h-6' />
      </button>
      <div className={`flex items-center ${toggleSearch && 'rounded-md border-2'}`}>
        <input
          className={`font-medium py-1 text-white outline-none bg-transparent transition-all duration-300 ${
            toggleSearch ? 'w-40 px-3' : 'w-0'
          }`}
          ref={inputRef}
          type='text'
          value={searchValue}
          onChange={({ target }) => dispatch(setSearchValue(target.value))}
        />

        {toggleSearch && (
          <button className='w-4 h-4 mr-1 transition hover:rotate-90' onClick={clearInput}>
            <XIcon />
          </button>
        )}
      </div>
    </div>
  );
};

export default Search;
