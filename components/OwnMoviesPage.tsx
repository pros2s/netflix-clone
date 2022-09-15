import { FC } from 'react';
import Head from 'next/head';
import Link from 'next/link';

import useAuth from '../hooks/useAuth';
import { useMovieList } from '../hooks/useMovieList';
import { useTypedSelector } from '../hooks/useTypedSelector';

import { modalSelector } from '../store/slices/modal';

import Thumbnail from './thumbnail/Thumbnail';
import Footer from './UI/Footer';
import Header from './UI/header/Header';
import Modal from './UI/modal/Modal';

interface OwnMoviesPageProps {
  pageName: string;
}

const OwnMoviesPage: FC<OwnMoviesPageProps> = ({ pageName }) => {
  const { isOpenedModal } = useTypedSelector(modalSelector);
  const { user } = useAuth();
  const pageList = useMovieList(user?.uid, pageName);

  let beforeSpan: string;
  let inSideSpan: string;
  let afterSpan: string;
  let afterLink: string;

  switch (pageName) {
    case 'myList':
      beforeSpan = 'Seems like your ';
      inSideSpan = 'list';
      afterSpan = " is empty. Let's go";
      afterLink = 'and add some movies.';
      break;
    case 'Liked':
      beforeSpan = 'Hmm.. Your ';
      inSideSpan = 'liked list';
      afterSpan = ' is empty. Why would you not go';
      afterLink = 'and like some movies.';
      break;
    default:
      beforeSpan = 'Your ';
      inSideSpan = 'disliked list';
      afterSpan = " is empty. Let's just leave it like that. But you can go";
      afterLink = 'and choose some movies to your list.';
      break;
  }

  return (
    <div className='relative'>
      <Head>
        <title>{pageName === 'myList' ? 'My List' : pageName}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header />
      <main className='flex flex-col items-center selection:bg-red-600 selection:text-white overflow-x-hidden md:pr-8 pt-20 min-h-screen md:pl-4 lg:pl-20 lg:pr-36'>
        <h1 className='text-3xl font-semibold lg:ml-14 mb-5 md:mb-14 lg:mb-16'>
          {pageName === 'myList' ? (
            <>
              My <span className='text-red-600 font-bold'>List</span>
            </>
          ) : (
            pageName
          )}
        </h1>

        {pageList.length === 0 ? (
          <h3 className='text-lg text-center px-3 md:text-xl md:mb-[70px] lg:ml-14'>
            {beforeSpan}
            <span className='text-red-600 font-bold'>{inSideSpan}</span>
            {afterSpan}{' '}
            <Link href={'/'}>
              <a>
                <span className='border-b-[1px] transition duration-150 cursor-pointer md:hover:border-b-red-600'>
                  back home
                </span>
              </a>
            </Link>{' '}
            {afterLink}
          </h3>
        ) : (
          <>
            <div className='md:pr-[55px] lg:pr-0'>
              <div className='flex flex-wrap items-center justify-center h-full gap-0.5 md:gap-1 mdmax:overflow-x-hidden md:pt-10 md:ml-0.5 md:-mx-[60px] md:mb-[70px]'>
                {pageList.map((movie) => (
                  <Thumbnail key={movie.id} movie={movie} />
                ))}
              </div>
            </div>
            {isOpenedModal && <Modal />}
          </>
        )}

        <div className='md:-ml-48 lg:-ml-[120px]'>
          <Footer isAbsolute={true} />
        </div>
      </main>
    </div>
  );
};

export default OwnMoviesPage;
