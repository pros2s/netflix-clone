import { NextPage } from 'next';

import useAuth from '../hooks/useAuth';

import OwnMoviesPage from '../components/OwnMoviesPage';

const myList: NextPage = () => {
  const { loading } = useAuth();

  if (loading) return null;

  return <OwnMoviesPage pageName='myList' />;
};

export default myList;
