import { useEffect } from 'react';
import { NextPage } from 'next';

import useAuth from '../hooks/useAuth';
import OwnMoviesPage from '../components/OwnMoviesPage';
import { useRouter } from 'next/router';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { profilesSelector } from '../store/slices/profiles';

const liked: NextPage = () => {
  const { loading } = useAuth();
  const router = useRouter();
  const { isWhoIsWatching } = useTypedSelector(profilesSelector);

  useEffect(() => {
    isWhoIsWatching && router.push('/manage');
  }, []);

  if (loading) return null;

  return <OwnMoviesPage pageName='last-viewed' />;
};

export default liked;
