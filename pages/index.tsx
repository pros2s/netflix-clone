import type { NextPage } from 'next';
import Head from 'next/head';

import ChoosingIcon from '../components/ChosingIcon';
import Plans from '../components/Plans';
import Header from '../components/UI/Header';
import Banner from '../components/Banner';
import Modal from '../components/Modal';
import Row from '../components/Row';
import Footer from '../components/UI/Footer';

import { subscriptionSelector } from '../store/slices/sutbscription';
import { modalSelector } from '../store/slices/modal';
import { profilesSelector } from '../store/slices/profiles';

import { useTypedSelector } from '../hooks/useTypedSelector';
import { useMovieList } from '../hooks/useMovieList';
import useAuth from '../hooks/useAuth';

import requests from '../utils/requests';
import { Movie } from '../types';

interface NextPageProps {
  netflixOriginals: Movie[];
  trendingNow: Movie[];
  topRated: Movie[];
  actionMovies: Movie[];
  comedyMovies: Movie[];
  horrorMovies: Movie[];
  romanceMovies: Movie[];
  documentaries: Movie[];
}

const Home: NextPage<NextPageProps> = ({
  netflixOriginals,
  actionMovies,
  comedyMovies,
  documentaries,
  horrorMovies,
  romanceMovies,
  topRated,
  trendingNow,
}) => {
  const { loading, user } = useAuth();
  const { isOpenedModal } = useTypedSelector(modalSelector);
  const { isSubscription } = useTypedSelector(subscriptionSelector);
  const { choosing } = useTypedSelector(profilesSelector);

  const myList = useMovieList(user?.uid, 'myList');
  const liked = useMovieList(user?.uid, 'Liked');
  const disliked = useMovieList(user?.uid, 'Disliked');

  if (loading) return null;
  if (choosing) return <ChoosingIcon isEditing={false} />;
  if (!isSubscription) return <Plans />;

  return (
    <div
      className={`relative h-screen bg-gradient-to-b lg:h-[140vh] selection:bg-red-600 selection:text-white ${
        isOpenedModal && 'overflow-hidden h-screen'
      }`}
    >
      <Head>
        <title>Home - Netflix</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Header />
      <main className='relative overflow-hidden pl-4 md:space-y-24 lg:px-16'>
        <Banner netflixOriginals={netflixOriginals} />
        <section className='md:space-y-32'>
          <Row title='Trending Now' movies={trendingNow} />
          <Row title='Top Rated' movies={topRated} />

          <Row title='My list' movies={myList} />
          <Row title='Liked' movies={liked} />

          <Row title='Action Thrillers' movies={actionMovies} />
          <Row title='Comedies' movies={comedyMovies} />
          <Row title='Scary Movies' movies={horrorMovies} />
          <Row title='Romance Movies' movies={romanceMovies} />
          <Row title='Documentaries' movies={documentaries} />

          <Row title='Disliked' movies={disliked} />
        </section>

        {isOpenedModal && <Modal />}
        <Footer />
      </main>
    </div>
  );
};

export const getServerSideProps = async () => {
  const [
    netflixOriginals,
    trendingNow,
    topRated,
    actionMovies,
    comedyMovies,
    horrorMovies,
    romanceMovies,
    documentaries,
  ] = await Promise.all([
    fetch(requests.fetchNetflixOriginals).then((res) => res.json()),
    fetch(requests.fetchTrending).then((res) => res.json()),
    fetch(requests.fetchTopRated).then((res) => res.json()),
    fetch(requests.fetchActionMovies).then((res) => res.json()),
    fetch(requests.fetchComedyMovies).then((res) => res.json()),
    fetch(requests.fetchHorrorMovies).then((res) => res.json()),
    fetch(requests.fetchRomanceMovies).then((res) => res.json()),
    fetch(requests.fetchDocumentaries).then((res) => res.json()),
  ]);

  return {
    props: {
      netflixOriginals: netflixOriginals.results,
      trendingNow: trendingNow.results,
      topRated: topRated.results,
      actionMovies: actionMovies.results,
      comedyMovies: comedyMovies.results,
      horrorMovies: horrorMovies.results,
      romanceMovies: romanceMovies.results,
      documentaries: documentaries.results,
    },
  };
};

export default Home;
