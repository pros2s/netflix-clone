import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { AuthProvider } from '../hooks/useAuth';
import { persistor, store } from '../store/store';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </PersistGate>
    </Provider>
  );
}

export default MyApp;
