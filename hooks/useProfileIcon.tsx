import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

import { useTypedSelector } from './useTypedSelector';
import { profilesSelector } from '../store/slices/profiles';

export const useProfileIcon = (userId: string | undefined) => {
  const { currentProfile } = useTypedSelector(profilesSelector);
  const [profileIcon, setProfileIcon] = useState<string>('');

  useEffect(() => {
    if (!userId) return;

    return onSnapshot(doc(db, 'users', userId, 'profiles', currentProfile), (snapshot) =>
      setProfileIcon('/icons/' + snapshot.data()?.profileIcon),
    );
  }, [db, userId]);

  return profileIcon;
};
