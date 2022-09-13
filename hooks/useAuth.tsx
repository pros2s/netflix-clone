import { createContext, FC, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { auth, db } from '../firebase';
import { collection, deleteDoc, doc, DocumentData, setDoc } from 'firebase/firestore';
import { getStorage, ref as storageRef } from 'firebase/storage';
import {
  createUserWithEmailAndPassword,
  deleteUser,
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  updatePassword,
  User,
} from 'firebase/auth';

import { useTypedDispatch } from './useTypedDispatch';
import { useTypedSelector } from './useTypedSelector';

import {
  loginIsChanging,
  loginIsNotChanging,
  passwordIsNotChanging,
} from '../store/slices/privateSettings';
import {
  isNotchoosingIcon,
  setIsWhoIsWatching,
  notAddingNewProfile,
  notManagingProfile,
  profilesSelector,
  setCurrentProfile,
} from '../store/slices/profiles';
import { userIsNotChangingPlan } from '../store/slices/sutbscription';

import { useProfiles } from './useProfiles';
import { Profile } from '../types';

interface IAuth {
  user: User | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  setNewEmail: (newEmail: string, password: string) => Promise<void>;
  setNewPassword: (newPassword: string, email: string) => Promise<void>;
  reAuth: (oldPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  editProfile: (
    editingIcon: string,
    inputVal: string,
    deleteProfile: Profile | DocumentData,
  ) => Promise<void>;
  deleteProfile: (name: string) => Promise<void>;
  addNewProfile: (profileIcon: string, newProfileName: string) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<IAuth>({
  user: null,
  signIn: async () => {},
  signUp: async () => {},
  logout: async () => {},
  setNewEmail: async () => {},
  setNewPassword: async () => {},
  reAuth: async () => {},
  deleteAccount: async () => {},
  editProfile: async () => {},
  deleteProfile: async () => {},
  addNewProfile: async () => {},
  loading: false,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useTypedDispatch();
  const { managingProfile, currentProfile } = useTypedSelector(profilesSelector);
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [InitialLoading, setInitialLoading] = useState<boolean>(true);

  const profiles = useProfiles(user?.uid);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setLoading(false);
      } else {
        setUser(null);
        setLoading(true);
        router.push('/login');
      }

      setLoading(false);
      setInitialLoading(false);
    });
  }, [auth]);

  const signUp = async (email: string, password: string) => {
    setLoading(true);

    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setUser(userCredential.user);

        const usersCol = collection(db, 'users');
        const userUid = auth.currentUser?.uid;

        setDoc(doc(usersCol, userUid), {
          email,
          password,
        });

        router.push('/');
        setLoading(false);
      })
      .finally(() => setLoading(false));
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);

    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setUser(userCredential.user);

        router.push('/manage');
        dispatch(setIsWhoIsWatching());
      })
      .finally(() => setLoading(false));
  };

  const logout = async () => {
    setLoading(true);

    await signOut(auth)
      .then(() => {
        setUser(null);

        dispatch(passwordIsNotChanging());
        dispatch(loginIsNotChanging());
        dispatch(notManagingProfile());
        dispatch(userIsNotChangingPlan());
        dispatch(isNotchoosingIcon());
      })
      .catch((error) => alert(error.message))
      .finally(() => setLoading(false));
  };

  const reAuth = async (oldPassword: string) => {
    setLoading(true);

    const credential = EmailAuthProvider.credential(auth.currentUser?.email!, oldPassword);
    await reauthenticateWithCredential(auth.currentUser!, credential).finally(() =>
      setLoading(false),
    );
  };

  const setNewEmail = async (newEmail: string, password: string) => {
    setLoading(true);

    await updateEmail(auth.currentUser!, newEmail)
      .then(() => {
        setDoc(doc(collection(db, 'users'), auth.currentUser?.uid), {
          email: newEmail,
          password,
        });
      })
      .catch((error) => {
        dispatch(loginIsChanging());
        alert(error.message);
      })
      .finally(() => setLoading(false));
  };

  const setNewPassword = async (newPassword: string, email: string) => {
    setLoading(true);

    await updatePassword(auth.currentUser!, newPassword)
      .then(() => {
        setDoc(doc(collection(db, 'users'), auth.currentUser?.uid), {
          email,
          password: newPassword,
        });
      })
      .finally(() => setLoading(false));
  };

  const deleteAccount = async () => {
    setLoading(true);

    profiles.forEach(
      async (profile) =>
        await deleteDoc(doc(db, 'users', auth.currentUser?.uid!, 'profiles', profile.name)),
    );
    await deleteDoc(doc(db, 'users', auth.currentUser?.uid!));
    await deleteUser(auth.currentUser!);

    setLoading(false);
  };

  const editProfile = async (
    editingIcon: string,
    inputValue: string,
    deleteProfile: Profile | DocumentData,
  ) => {
    setLoading(true);

    const storage = getStorage();
    const iconRef = storageRef(storage, editingIcon);

    const newProfile: Profile = {
      profileIcon: iconRef.name || deleteProfile.profileIcon,
      name: inputValue || deleteProfile.name,
    };

    await deleteDoc(doc(db, 'users', user?.uid!, 'profiles', deleteProfile.name)).then(() => {
      setDoc(
        doc(db, 'users', user?.uid!, 'profiles', inputValue || deleteProfile.name),
        newProfile,
      );

      currentProfile === deleteProfile.name && dispatch(setCurrentProfile(newProfile.name));
      dispatch(notManagingProfile());
    });

    setLoading(false);
  };

  const deleteProfile = async (name: string) => {
    setLoading(true);

    await deleteDoc(doc(db, 'users', user?.uid!, 'profiles', name));
    dispatch(notManagingProfile());

    if (name === currentProfile) {
      dispatch(setIsWhoIsWatching());
      router.push('/manage');
    }

    setLoading(false);
  };

  const addNewProfile = async (profileIcon: string, newProfileName: string) => {
    setLoading(true);

    await setDoc(doc(db, 'users', user?.uid!, 'profiles', newProfileName), {
      profileIcon,
      name: newProfileName,
    });

    dispatch(notAddingNewProfile());
    dispatch(notManagingProfile());

    setLoading(false);
  };

  const memoedValue = useMemo(
    () => ({
      user,
      signUp,
      signIn,
      loading,
      logout,
      setNewEmail,
      setNewPassword,
      reAuth,
      deleteAccount,
      editProfile,
      deleteProfile,
      addNewProfile,
    }),
    [user, loading],
  );

  return (
    <AuthContext.Provider value={memoedValue}>{!InitialLoading && children}</AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}
