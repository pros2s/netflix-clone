import Link from 'next/link';
import { FC, useEffect, useState } from 'react';
import { BellIcon, SearchIcon } from '@heroicons/react/solid';


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
    <header className={`${isScrolled && 'bg-[#141414]'}`}>
      <div className='flex items-center space-x-2 md:space-x-10'>
        <img
          src='https://rb.gy/ulxxee'
          alt='logo'
          width={100}
          height={100}
          className='cursor-pointer object-contain'
        />

        <ul className='hidden space-x-4 md:flex'>
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
        <BellIcon className='h-6 w-6' />
        <Link href='/accounts'>
          <img src='https://rb.gy/g1pwyx' alt='accounts' className='cursor-pointer rounded' />
        </Link>
      </div>
    </header>
  );
};


export default Header;
