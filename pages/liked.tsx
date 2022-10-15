import { useEffect } from 'react';
import { NextPage } from 'next';

import useAuth from '../hooks/useAuth';
import OwnMoviesPage from '../components/OwnMoviesPage';

const liked: NextPage = () => {
  const { loading } = useAuth();

  useEffect(() => {}, []);

  if (loading) return null;

  return <OwnMoviesPage pageName='Liked' />;
};

export default liked;
