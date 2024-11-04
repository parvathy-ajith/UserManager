import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { AuthContext } from '../auth/AuthContext';

function Navibar() {
  const navigate = useNavigate();
  const { token, logout } = useContext(AuthContext);
  const isLoggedIn = !!token;

  const handleLogout = () => {
    //AuthContext remove token
    logout();
    navigate('/');
  };

  return (
    <Navbar bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand>User Manager</Navbar.Brand>
        <Nav className="justify-content-end">
          {isLoggedIn && (
            <Nav.Link onClick={handleLogout} href="#logout">Logout</Nav.Link>
          )}
        </Nav>
      </Container>
    </Navbar>
  )
}

export default Navibar