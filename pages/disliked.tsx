import { NextPage } from 'next';

import useAuth from '../hooks/useAuth';

import OwnMoviesPage from '../components/OwnMoviesPage';

const disliked: NextPage = () => {
  const { loading } = useAuth();

  if (loading) return null;

  return <OwnMoviesPage pageName='Disliked' />;
};

export default disliked;
