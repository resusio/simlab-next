import React, { FunctionComponent } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth0 } from '@auth0/auth0-react';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Spinner from 'react-bootstrap/Spinner';

import { asSimlabUser, isValidUser } from '../utils/authTypes';

interface HeaderBarProps {}

const HeaderBar: FunctionComponent<HeaderBarProps> = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading, user, logout, loginWithPopup } = useAuth0();

  const currentUser = asSimlabUser(user); //isValidUser(user) ? user : null;

  const logoutRedirectUrl =
    (typeof window !== 'undefined' && window?.location?.origin) || undefined;

  const ProfilePicture = (
    <img style={{ height: '2rem' }} className="rounded-circle border" src={currentUser?.avatar} />
  );

  return (
    <Navbar bg="secondary" variant="dark" expand="sm" sticky="top">
      <Navbar.Brand href="https://www.resuscitate.io">
        <img src="/logo.svg" style={{ height: '2rem', width: 'auto' }} />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto" activeKey={'/' + router.pathname.split('/')[1]}>
          <Link href="/" passHref>
            <Nav.Link>Home</Nav.Link>
          </Link>
          <Link href="/LabReport" passHref>
            <Nav.Link>Lab Report</Nav.Link>
          </Link>
          <Link href="/Contact" passHref>
            <Nav.Link>Contact</Nav.Link>
          </Link>
          <Link href="/Roadmap" passHref>
            <Nav.Link>Roadmap</Nav.Link>
          </Link>
        </Nav>
        <Nav suppressHydrationWarning={true}>
          {isLoading ? (
            <NavDropdown
              alignRight
              title={
                <Spinner
                  animation="border"
                  variant="primary"
                  style={{ height: '1.8rem', width: '1.8rem' }}
                />
              }
              id="basic-nav-dropdown"
            />
          ) : isAuthenticated ? (
            <NavDropdown alignRight title={ProfilePicture} id="basic-nav-dropdown">
              <NavDropdown.ItemText>
                <div>
                  {currentUser?.firstName} {currentUser?.lastName}
                </div>
                <div>
                  <em>
                    <small>{currentUser?.email}</small>
                  </em>
                </div>
              </NavDropdown.ItemText>
              <NavDropdown.Divider />
              <Link href="/ListSavedReports" passHref>
                <NavDropdown.Item active={router.pathname === '/ListSavedReports'}>
                  My Lab Reports
                </NavDropdown.Item>
              </Link>
              <NavDropdown.Item>Preferences</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={() => logout({ returnTo: logoutRedirectUrl })}>
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          ) : (
            <Nav.Link onClick={() => loginWithPopup()}>Sign In</Nav.Link>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default HeaderBar;
