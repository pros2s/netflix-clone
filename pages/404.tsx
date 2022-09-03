import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

import netflix from '../assets/netflix.png';

const NotFound: FC = () => {
  return (
    <div className='flex h-screen w-screen flex-col bg-black items-center justify-center md:bg-transparent selection:bg-red-600 selection:text-white'>
      <div className='absolute left-4 top-4 cursor-pointer object-contain md:left-10 md:top-6'>
        <Image src={netflix} alt='icon' width={150} height={50} />
      </div>

      <div className='flex flex-col md:flex-row'>
        <h1 className='text-[40px] md:text-[50px] max-w-[23rem] border-b-2 pb-3 md:max-w-[15rem] md:border-b-0 md:border-r-2'>
          Page not found
        </h1>
        <h2 className='text-[80px] text-red-600 text-center md:text-[100px] md:ml-6'>404</h2>
      </div>

      <p className='text-lg mt-6 md:text-2xl md:mt-12'>
        Come{' '}
        <Link href={'/'}>
          <span className='border-b-[1px] border-b-red-600 transition duration-150 cursor-pointer md:border-b-white md:hover:border-b-red-600'>
            back home
          </span>
        </Link>{' '}
      </p>
    </div>
  );
};

export default NotFound;
