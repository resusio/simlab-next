import { AppProps } from 'next/app';
import Head from 'next/head';
import Router from 'next/router';
import { Auth0Provider } from '@auth0/auth0-react';

import Container from 'react-bootstrap/Container';

import '../styles/globals.scss';

import { SettingsProvider } from '../contexts/settingsContext';
import { SimlabProvider } from '../contexts/simlabContext';

import HeaderBar from '../components/HeaderBar';

function MyApp({ Component, pageProps }: AppProps) {
  const redirectUri = (typeof window !== 'undefined' && window?.location?.origin) || undefined;

  return (
    <>
      <Head>
        <title>Resus.io - Simlab</title>
        <link rel="apple-touch-icon" sizes="180x180" href="favicons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="favicons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="favicons/favicon-16x16.png" />
        <link rel="manifest" href="favicons/site.webmanifest" />
        <link rel="mask-icon" href="favicons/safari-pinned-tab.svg" color="#5bbad5" />
        <link rel="shortcut icon" href="favicons/favicon.ico" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="msapplication-config" content="favicons/browserconfig.xml" />
        <meta name="theme-color" content="#D8DEE9" />
      </Head>
      {/* Page starts here */}
      <Auth0Provider
        domain="resusio.us.auth0.com"
        clientId="iQSuKM0cu8NBtyaU50oqcH7eyPU3KBVE"
        redirectUri={redirectUri}
        scope="save:report"
        onRedirectCallback={(appState) => {
          Router.replace(appState?.returnTo || '/');
        }}
      >
        <SettingsProvider>
          <SimlabProvider>
            <HeaderBar />
            <Container fluid className="pt-2">
              <Component {...pageProps} />
            </Container>
          </SimlabProvider>
        </SettingsProvider>
      </Auth0Provider>
    </>
  );
}

export default MyApp;
