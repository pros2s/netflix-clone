import { createContext, FC, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { auth, db } from '../firebase';
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  updatePassword,
  User,
} from 'firebase/auth';

import { loginIsChanging, passwordIsChanging } from '../store/slices/privateSettings';
import { useTypedDispatch } from './useTypedDispatch';
import { collection, doc, setDoc } from 'firebase/firestore';

interface IAuth {
  user: User | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  setNewEmail: (newEmail: string) => Promise<void>;
  setNewPassword: (newPassword: string) => Promise<void>;
  reAuth: (oldPassword: string) => Promise<void>;
  logout: () => Promise<void>;
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
      })
      .catch((error) => alert(error.message))
      .finally(() => setLoading(false));
  };

  const reAuth = async (oldPassword: string) => {
    setLoading(true);

    if (auth.currentUser?.email) {
      const credential = EmailAuthProvider.credential(auth.currentUser.email, oldPassword);
      await reauthenticateWithCredential(auth.currentUser, credential).finally(() =>
        setLoading(false),
      );
    } else {
      setLoading(false);
    }
  };

  const setNewEmail = async (newEmail: string) => {
    setLoading(true);

    if (auth.currentUser) {
      await updateEmail(auth.currentUser, newEmail)
        .catch((error) => {
          dispatch(loginIsChanging());
          alert(error.message);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  };

  const setNewPassword = async (newPassword: string) => {
    setLoading(true);

    if (auth.currentUser) {
      await updatePassword(auth.currentUser, newPassword).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
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
