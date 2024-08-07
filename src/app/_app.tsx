
import { AppProps } from 'next/app';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { UserProvider } from '../contexts/UserContext';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <DefaultLayout>
        <Component {...pageProps} />
      </DefaultLayout>
    </UserProvider>
  );
}

export default MyApp;
