import { FC, useEffect, useState } from 'react';
import Image from 'next/image';

import PagesList from './PagesList';
import BasicMenu from './BasicMenu';
import Search from './Search';
import Account from './Account';

import netflix from '../../../assets/netflix.png';

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
    <header
      className={`selection:bg-red-600 selection:text-white h-16 ${
        isScrolled ? 'bg-[#141414]' : 'bg-[#141414]/50'
      }`}
    >
      <div className='flex items-center space-x-2 lg:ml-[49px] md:space-x-10'>
        <Image className='md:cursor-pointer' src={netflix} alt='logo' width={120} height={35} />

        <BasicMenu />
        <PagesList />
      </div>

      <div className='flex items-center space-x-4 font-light text-sm lg:mr-12'>
        <Search />

        <Account />
      </div>
    </header>
  );
};

export default Header;
