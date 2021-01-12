import { useContext, useEffect, FC, useState } from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import Router, { useRouter } from 'next/router';
import { Auth0Provider, useAuth } from 'use-auth0-hooks';

import Container from 'react-bootstrap/Container';

import '../styles/globals.scss';

import { UserProvider, UserContext } from '../contexts/userContext';
import { SettingsProvider } from '../contexts/settingsContext';
import { SimlabProvider } from '../contexts/simlabContext';

import HeaderBar from '../components/headerBar';

const PageTemplate: FC = ({ children }) => {
  const { isAuthenticated, isLoading, login, logout, user } = useAuth();
  const { pathname, query } = useRouter();

  const userCtx = useContext(UserContext);

  useEffect(() => {
    if (userCtx.setUser && user) {
      userCtx.setUser({
        userId: user.sub,
        firstName: user.given_name,
        lastName: user.family_name,
        username: user.nickname,
        email: user.email,
        avatarPicture: user.picture,
      });
    }
  }, [user]);

  return (
    <>
      <HeaderBar
        isLoggedIn={isAuthenticated}
        loginLoading={isLoading}
        avatarPicture={user?.picture}
        username={user?.name}
        email={user?.email}
        loginClick={() => {
          login({ appState: { returnTo: { pathname, query } } });
        }}
        logoutClick={() => {
          logout({ returnTo: process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3000' });
        }}
      />
      <Container fluid className="pt-2">
        {children}
      </Container>
      {/*<div className="d-block d-sm-none">xs</div>
      <div className="d-none d-sm-block d-md-none">sm</div>
      <div className="d-none d-md-block d-lg-none">md</div>
      <div className="d-none d-lg-block d-xl-none">lg</div>
      <div className="d-none d-xl-block d-xxl-none">xl</div>
      <div className="d-none d-xxl-block">xxl</div>*/}
    </>
  );
};

function MyApp({ Component, pageProps }: AppProps) {
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
        redirectUri={process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3000'}
        onRedirectCallback={(appState) => {
          if (appState?.returnTo) {
            Router.push({
              pathname: appState.returnTo.pathname,
              query: appState.returnTo.query,
            });
          }
        }}
      >
        <UserProvider>
          <SettingsProvider>
            <SimlabProvider>
              <PageTemplate>
                <Component {...pageProps} />
              </PageTemplate>
            </SimlabProvider>
          </SettingsProvider>
        </UserProvider>
      </Auth0Provider>
    </>
  );
}

export default MyApp;
