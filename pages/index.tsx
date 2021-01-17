//import React, { useContext, FunctionComponent, MouseEvent } from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth0 } from '@auth0/auth0-react';

import Jumbotron from 'react-bootstrap/Jumbotron';
import Button from 'react-bootstrap/Button';

import { asSimlabUser } from '../utils/authTypes';

import styles from '../styles/home.module.scss';

function FrontPage() {
  const { user } = useAuth0();
  const router = useRouter();

  const currentUser = asSimlabUser(user);

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
              router.push('LabReport');
            }}
          >
            Start a Lab Report
          </Button>
          {currentUser?.userId ? (
            <Button
              variant="success"
              className="ml-2"
              onClick={(e) => {
                router.push('ListSavedReports');
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
