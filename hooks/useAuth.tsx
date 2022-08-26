import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  User,
} from 'firebase/auth';
import { useRouter } from 'next/router';
import { createContext, FC, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { auth } from '../firebase';

interface IAuth {
  user: User | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  setNewEmail: (newEmail: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<IAuth>({
  user: null,
  signIn: async () => {},
  signUp: async () => {},
  logout: async () => {},
  setNewEmail: async () => {},
  loading: false,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
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

      setInitialLoading(false);
    });
  }, [auth]);

  const signUp = async (email: string, password: string) => {
    setLoading(true);

    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setUser(userCredential.user);
        router.push('/');
        setLoading(false);
      })
      .catch((error) => alert(error.message))
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
      .catch((error) => alert(error.message))
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

  const setNewEmail = async (newEmail: string) => {
    setLoading(true);

    if (auth.currentUser) {
      await updateEmail(auth.currentUser, newEmail)
        .then(() => {
          // Email updated!
          // ...
          setLoading(false);
        })
        .catch((error) => alert(error.message))
        .finally(() => setLoading(false));
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
