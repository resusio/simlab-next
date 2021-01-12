import React, { useContext, FunctionComponent, MouseEvent } from 'react';

import { UserContext } from '../contexts/userContext';

import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../styles/home.module.scss';

import Jumbotron from 'react-bootstrap/Jumbotron';
import Button from 'react-bootstrap/Button';

function FrontPage() {
  const { user } = useContext(UserContext);
  const router = useRouter();

  return (
    <>
      <Head>
        <title>SimLab</title>
      </Head>
      <Jumbotron>
        <h1>Welcome to SimLab!</h1>
        <h3>
          <small className="text-muted">
            Create mock lab reports on-the-fly for medical simulation.
          </small>
        </h3>
        <p className="mt-4">
          <Button
            variant="primary"
            className="mr-2"
            onClick={(e) => {
              router.push('labReport');
            }}
          >
            Start a Lab Report
          </Button>
          {user?.userId ? (
            <Button
              variant="success"
              className="ml-2"
              onClick={(e) => {
                router.push('listSavedReports');
              }}
            >
              Load a Lab Report...
            </Button>
          ) : null}
        </p>
      </Jumbotron>
    </>
  );
}

export default FrontPage;
