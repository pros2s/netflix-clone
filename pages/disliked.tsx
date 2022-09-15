import { useEffect } from 'react';

import { NextPage } from 'next';
import { useRouter } from 'next/router';

import useAuth from '../hooks/useAuth';
import { useTypedSelector } from '../hooks/useTypedSelector';

import { profilesSelector } from '../store/slices/profiles';
import OwnMoviesPage from '../components/OwnMoviesPage';

const disliked: NextPage = () => {
  const router = useRouter();
  const { isWhoIsWatching } = useTypedSelector(profilesSelector);
  const { loading, user } = useAuth();

  useEffect(() => {
    if (isWhoIsWatching) router.push('/manage');
  }, []);

  if (loading) return null;

  return <OwnMoviesPage pageName='Disliked' />;
};

export default disliked;
