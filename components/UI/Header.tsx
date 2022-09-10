import Link from 'next/link';
import Image from 'next/image';

import { FC, useEffect, useState, useRef } from 'react';
import { BellIcon, SearchIcon } from '@heroicons/react/solid';
import { XIcon } from '@heroicons/react/outline';

import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useTypedDispatch } from '../../hooks/useTypedDispatch';
import { useProfileIcon } from '../../hooks/useProfileIcon';
import useAuth from '../../hooks/useAuth';

import { searchSelector, setSearchValue } from '../../store/slices/search';
import { profilesSelector } from '../../store/slices/profiles';

import BasicMenu from './BasicMenu';
import Loader from './Loader';

import netflix from '../../assets/netflix.png';

const Header: FC = () => {
  const dispatch = useTypedDispatch();
  const { searchValue } = useTypedSelector(searchSelector);
  const { currentProfile } = useTypedSelector(profilesSelector);

  const { loading, user } = useAuth();
  const profileIcon = useProfileIcon(user?.uid);
  const inputRef = useRef<HTMLInputElement>(null);

  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [toggleSearch, setToggleSearch] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      window.scrollY > 0 ? setIsScrolled(true) : setIsScrolled(false);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const searchClickHandler = () => {
    inputRef.current?.focus();
    setToggleSearch((state) => !state);
  };

  const clearInput = () => {
    dispatch(setSearchValue(''));
    setTimeout(() => {
      setToggleSearch(false);
    }, 50);
  };

  return (
    <header
      className={`selection:bg-red-600 selection:text-white h-16 ${isScrolled && 'bg-[#141414]'}`}
    >
      <div className='flex items-center space-x-2 lg:ml-[49px] md:space-x-10'>
        <Image className='md:cursor-pointer' src={netflix} alt='logo' width={120} height={35} />

        {loading && <Loader color='dark:fill-red-600' />}
        <BasicMenu />

        <ul className='hidden gap-x-4 md:flex'>
          <li className='headerLink'>
            <Link href='/'>Home</Link>
          </li>
          <li className='headerLink'>
            <Link href='/myList'>My List</Link>
          </li>
          <li className='headerLink'>
            <Link href='/liked'>Liked</Link>
          </li>
          <li className='headerLink'>
            <Link href='/disliked'>Disliked</Link>
          </li>
        </ul>
      </div>

      <div className='flex items-center space-x-4 font-light text-sm lg:mr-12'>
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
        <p className='hidden lg:inline'>Kids</p>
        <BellIcon className='h-6 w-6 !mr-1' />
        <Link href='/account'>
          <a>
            <Image
              src={profileIcon || '/icons/yellow'}
              height={35}
              width={35}
              alt={currentProfile}
              className='cursor-pointer rounded'
            />
          </a>
        </Link>
      </div>
    </header>
  );
};

export default Header;
