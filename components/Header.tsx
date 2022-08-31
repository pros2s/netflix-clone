import Link from 'next/link';
import Image from 'next/image';
import { FC, useEffect, useState } from 'react';
import { BellIcon, SearchIcon } from '@heroicons/react/solid';
import BasicMenu from './BasicMenu';

import netflix from '../assets/netflix.png';
import account from '../assets/account.png';

const Header: FC = () => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      window.scrollY > 0 ? setIsScrolled(true) : setIsScrolled(false);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`h-16 ${isScrolled && 'bg-[#141414]'}`}>
      <div className='flex items-center space-x-2 lg:ml-[49px] md:space-x-10'>
        <Image
          src={netflix}
          alt='logo'
          width={100}
          height={100}
          className='cursor-pointer object-contain'
        />

        <BasicMenu />

        <ul className='hidden gap-x-4 md:flex'>
          <li className='headerLink'>Home</li>
          <li className='headerLink'>TV Shows</li>
          <li className='headerLink'>Movies</li>
          <li className='headerLink'>New & Popular</li>
          <li className='headerLink'>My List</li>
        </ul>
      </div>

      <div className='flex items-center space-x-4 font-light text-sm'>
        <SearchIcon className='hidden w-6 h-6 sm:inline' />
        <p className='hidden lg:inline'>Kids</p>
        <BellIcon className='h-6 w-6 !mr-4' />
        <Link href='/account'>
          <Image src={account} alt='accounts' className='cursor-pointer rounded' />
        </Link>
      </div>
    </header>
  );
};

export default Header;
