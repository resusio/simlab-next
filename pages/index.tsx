import React, { useContext, FunctionComponent, MouseEvent } from 'react';

import { UserContext } from '../contexts/userContext';

import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/home.module.scss';

import Jumbotron from 'react-bootstrap/Jumbotron';
import Button from 'react-bootstrap/Button';

function FrontPage() {
  const userCtx = useContext(UserContext);

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
          <pre>{process.env.NEXT_PUBLIC_ROOT_URL ?? "tester"}</pre>
        </h3>
        <p className="mt-4">
          <Button variant="primary">Start a Lab Report</Button>
        </p>
      </Jumbotron>
    </>
  );
}

export default FrontPage;
