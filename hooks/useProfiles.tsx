import { useEffect, useState } from 'react';
import { collection, DocumentData, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

import { Profile } from '../types';

export const useProfiles = (userId: string | undefined) => {
  const [profiles, setProfiles] = useState<Profile[] | DocumentData[]>([]);

  useEffect(() => {
    if (!userId) return;

    return onSnapshot(collection(db, 'users', userId, 'profiles'), (snapshot) => {
      setProfiles(
        snapshot.docs.map((doc) => ({
          name: doc.id,
          ...doc.data(),
        })),
      );
    });
  }, [db, userId]);

  return profiles;
};
