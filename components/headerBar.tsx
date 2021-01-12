import React, { FunctionComponent } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Spinner from 'react-bootstrap/Spinner';

interface HeaderBarProps {
  isLoggedIn?: boolean;
  loginLoading?: boolean;
  avatarPicture?: string;
  username?: string;
  email?: string;
  loginClick?: () => void;
  logoutClick?: () => void;
}

const HeaderBar: FunctionComponent<HeaderBarProps> = ({
  isLoggedIn,
  loginLoading,
  loginClick,
  logoutClick,
  avatarPicture,
  username,
  email,
}: HeaderBarProps) => {
  const router = useRouter();

  const ProfilePicture = (
    <img style={{ height: '2rem' }} className="rounded-circle border" src={avatarPicture} />
  );

  return (
    <Navbar bg="secondary" variant="dark" expand="lg" sticky="top">
      <Navbar.Brand href="https://www.resuscitate.io">
        <img src="/logo.svg" style={{ height: '2rem', width: 'auto' }} />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto" activeKey={'/' + router.pathname.split('/')[1]}>
          <Link href="/" passHref>
            <Nav.Link>Home</Nav.Link>
          </Link>
          <Link href="/labReport" passHref>
            <Nav.Link>Lab Report</Nav.Link>
          </Link>
          <Link href="/roadmap" passHref>
            <Nav.Link>Roadmap</Nav.Link>
          </Link>
        </Nav>
        <Nav>
          {loginLoading ? (
            <Spinner animation="border" variant="primary" />
          ) : isLoggedIn ? (
            <NavDropdown alignRight title={ProfilePicture} id="basic-nav-dropdown">
              <NavDropdown.ItemText>
                <div>{username}</div>
                <div>
                  <em>
                    <small>{email}</small>
                  </em>
                </div>
              </NavDropdown.ItemText>
              <NavDropdown.Divider />
              <NavDropdown.Item>My Lab Reports</NavDropdown.Item>
              <NavDropdown.Item>Preferences</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={logoutClick}>Logout</NavDropdown.Item>
            </NavDropdown>
          ) : (
            <Nav.Link onClick={loginClick}>Login</Nav.Link>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

HeaderBar.defaultProps = {
  isLoggedIn: false,
  loginLoading: false,
  avatarPicture: '',
  username: '',
  email: '',
};

export default HeaderBar;
