import { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, NavLink } from 'react-router-dom';
import { Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import styled from 'styled-components';
import Avatar from 'boring-avatars';

import firebase from '../utils/firebase';
import logo from '../images/logo.png';

const Container = styled.div`
  height: auto;
  background-color: #ffeade;
`;

const ContentContainer = styled.div`
  margin: 0 auto;
  width: 100%;
  height: 100%;
  padding-top: 70px;
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

const Logo = styled.img`
  width: 180px;
`;

const NavItem = styled.li`
  font-size: 20px;
  color: ${props => (props.isActive ? '#e17f45' : 'white')};
  margin: 10px 20px;
`;

const ImageWrapper = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background: #f5cdc5;
  margin-right: 13px;
  overflow: hidden;
  margin-right: 20px;
  cursor: pointer;
`;

const StyledImg = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
`;

const LoginButton = styled.div`
  margin-left: auto;
  padding: 10px 30px;
  cursor: pointer;
  color: white;
  font-weight: 700;
  &:hover {
    background: #e3e3e3;
  }
`;

const StyledNavLink = styled(NavLink)`
  font-size: 24px;
  margin: 10px 5px;
`;

const Span = styled.span`
  color: ${props => (props.isActive ? '#e17f45' : 'white')};
  font-weight: ${props => (props.isActive ? '700' : '500')};
  &:hover {
    color: #e17f45;
    font-weight: 700;
  }
`;

const Nav = ({ userInfo, currentUserId }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    firebase
      .signOut()
      .then(() => {
        alert('已成功登出');
        navigate('/login', { state: { from: { pathname: '/notes' } } });
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleLogIn = () => {
    navigate('/login', { state: { from: { pathname: '/notes' } } });
  };

  const goToProfile = () => {
    navigate(`/profile/${currentUserId}`);
  };

  return (
    <StyledNav>
      <Ul>
        <NavItem>
          <Link to="/notes">
            <Logo alt="logo" src={logo} />
          </Link>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/notes">
            {({ isActive }) => <Span isActive={isActive}>Notes</Span>}
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/practice">
            {({ isActive }) => <Span isActive={isActive}>Practice</Span>}
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/messages">
            {({ isActive }) => <Span isActive={isActive}>Messages</Span>}
          </StyledNavLink>
        </NavItem>
        {currentUserId ? (
          <Menu>
            <MenuButton ml="auto">
              <ImageWrapper>
                {userInfo?.photo_url ? (
                  <StyledImg
                    src={userInfo && userInfo.photo_url}
                    alt="head-shot"
                  />
                ) : (
                  <Avatar
                    size={60}
                    name={userInfo?.display_name}
                    variant="beam"
                    colors={[
                      '#C1DDC7',
                      '#F5E8C6',
                      '#BBCD77',
                      '#DC8051',
                      '#F4D279',
                    ]}
                  />
                )}
              </ImageWrapper>
            </MenuButton>
            <MenuList w="100px">
              <MenuItem onClick={goToProfile}>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>登出</MenuItem>
            </MenuList>
          </Menu>
        ) : (
          <LoginButton onClick={handleLogIn}>登入</LoginButton>
        )}
      </Ul>
    </StyledNav>
  );
};

const Layout = () => {
  const currentUserId = firebase.auth.currentUser?.uid;
  const [userInfo, setUserInfo] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [active, setActive] = useState(null);
  const [companies, setCompanies] = useState(null);
  const [jobTitles, setJobTitles] = useState(null);

  useEffect(() => {
    if (!currentUserId) return;
    const unsubscribe = firebase.listenUserProfileChange(
      currentUserId,
      setUserInfo
    );

    return () => unsubscribe();
  }, [currentUserId]);

  const props = {
    currentUserId,
    userInfo,
    chatOpen,
    setChatOpen,
    active,
    setActive,
    companies,
    setCompanies,
    jobTitles,
    setJobTitles,
  };

  return (
    <Container>
      <Nav
        userInfo={userInfo}
        currentUserId={currentUserId}
        setUserInfo={setUserInfo}
      />
      <ContentContainer>
        <Outlet context={props} />
      </ContentContainer>
    </Container>
  );
};

export default Layout;
