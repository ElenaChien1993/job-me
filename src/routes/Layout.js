import { Outlet, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import firebase from '../utils/firebase';

const Container = styled.div`
  height: auto;
`;

const ContentContainer = styled.div`
  margin: 0 auto;
  width: 100%;
  height: 100%;
  background-color: #ffeade;
`;

const StyledNav = styled.nav`
  width: 100vw;
  height: 70px;
  background-color: #306172;
  position: fixed;
  z-index: 5;
`;

const Ul = styled.ul`
  display: flex;
  height: 70px;
  align-items: center;
`;

const NavItem = styled.li`
  font-size: 20px;
  color: white;
  margin: 10px 20px;
`;

const Logout = styled.button`
  color: white;
  background-color: #306172;
  margin-left: auto;
  margin-right: 20px;
`;

const Nav = ({ isLogin }) => {
  const currentUserId = firebase.auth.currentUser?.uid
  const navigate = useNavigate();

  const handleLogout = () => {
    firebase
      .signOut()
      .then(() => {
        alert('已成功登出');
        navigate('/login', { state: { from: { pathname: '/notes' } } });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <StyledNav>
      <Ul>
        <NavItem>
          <Link to="/notes">Notes</Link>
        </NavItem>
        <NavItem>
          <Link to="/practice">Practice</Link>
        </NavItem>
        <NavItem>
          <Link to={`/profile/${currentUserId}`}>Profile</Link>
        </NavItem>
        <NavItem>
          <Link to="/messages">Messages</Link>
        </NavItem>
        {!isLogin && <Logout onClick={handleLogout}>Log out</Logout>}
      </Ul>
    </StyledNav>
  );
};

const Layout = ({ isLogin }) => {
  return (
    <Container>
      <Nav isLogin={isLogin} />
      <ContentContainer>
        <Outlet />
      </ContentContainer>
    </Container>
  );
};

export default Layout;
