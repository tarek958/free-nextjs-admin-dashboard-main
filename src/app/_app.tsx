import { AppProps } from 'next/app';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { UserProvider } from '../contexts/UserContext';
import { AuthProvider } from '../contexts/AuthContext'; // Import AuthProvider
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <UserProvider>
        <DefaultLayout>
          <Component {...pageProps} />
        </DefaultLayout>
      </UserProvider>
    </AuthProvider>
  );
}

export default MyApp;
