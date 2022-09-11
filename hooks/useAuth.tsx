import { createContext, FC, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { auth, db } from '../firebase';
import { collection, deleteDoc, doc, setDoc } from 'firebase/firestore';
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

import {
  loginIsChanging,
  loginIsNotChanging,
  passwordIsNotChanging,
} from '../store/slices/privateSettings';
import { isNotchoosingIcon, notEditingProfile } from '../store/slices/profiles';
import { userIsNotChangingPlan } from '../store/slices/sutbscription';

import { useProfiles } from './useProfiles';

interface IAuth {
  user: User | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  setNewEmail: (newEmail: string, password: string) => Promise<void>;
  setNewPassword: (newPassword: string, email: string) => Promise<void>;
  reAuth: (oldPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
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
  loading: false,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useTypedDispatch();
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
        router.push('/');
        setLoading(false);
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
        dispatch(notEditingProfile());
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
