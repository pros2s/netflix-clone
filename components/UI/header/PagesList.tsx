import { FC } from 'react';
import Link from 'next/link';

const PagesList: FC = () => {
  return (
    <ul className='hidden gap-x-4 md:flex'>
      <li className='headerLink'>
        <Link href='/'>
          <a>Home</a>
        </Link>
      </li>
      <li className='headerLink'>
        <Link href='/myList'>
          <a>My List</a>
        </Link>
      </li>
      <li className='headerLink'>
        <Link href='/liked'>
          <a>Liked</a>
        </Link>
      </li>
      <li className='headerLink'>
        <Link href='/disliked'>
          <a>Disliked</a>
        </Link>
      </li>
    </ul>
  );
};

export default PagesList;
