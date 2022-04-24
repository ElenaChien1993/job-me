import { useEffect, useRef, useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Avatar from 'boring-avatars';

import useClickOutside from '../hooks/useClickOutside';
import firebase from '../utils/firebase';

const Container = styled.div`
  height: auto;
`;

const ContentContainer = styled.div`
  margin: 0 auto;
  width: 100%;
  height: 100%;
  background-color: #ffeade;
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

const NavItem = styled.li`
  font-size: 20px;
  color: white;
  margin: 10px 20px;
`;

const ImageWrapper = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background: #f5cdc5;
  margin-right: 13px;
  overflow: hidden;
  margin-left: auto;
  margin-right: 20px;
  cursor: pointer;
`;

const StyledImg = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
`;

const MenuWrapper = styled.div`
  position: absolute;
  right: 0;
  top: 55px;
  width: 120px;
  height: 100px;
  background-color: white;
  box-shadow: 4px 4px 4px 1px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  padding: 10px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1;
`;

const Option = styled.div`
  padding: 10px 15px;
  cursor: pointer;
  &:hover {
    background: #e3e3e3;
  }
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

const Nav = ({ isLogin, userInfo, currentUserId, setUserInfo }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef();

  useClickOutside(menuRef, () => isMenuOpen && setIsMenuOpen(false));

  const handleLogout = () => {
    firebase
      .signOut()
      .then(() => {
        setUserInfo(null);
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
    setIsMenuOpen(false);
    navigate(`/profile/${currentUserId}`);
  };

  console.log('nav', isLogin)

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
          <Link to="/messages">Messages</Link>
        </NavItem>
        {isLogin ? (
          <ImageWrapper onClick={() => setIsMenuOpen(true)}>
            {userInfo.photo_url ? (
              <StyledImg src={userInfo && userInfo.photo_url} alt="head-shot" />
            ) : (
              <Avatar
                size={60}
                name={userInfo?.display_name}
                variant="beam"
                colors={['#C1DDC7', '#F5E8C6', '#BBCD77', '#DC8051', '#F4D279']}
              />
            )}
          </ImageWrapper>
        ) : (
          <LoginButton onClick={handleLogIn}>登入</LoginButton>
        )}
        {isMenuOpen && (
          <MenuWrapper ref={menuRef}>
            <Option onClick={goToProfile}>Profile</Option>
            <Option onClick={handleLogout}>登出</Option>
          </MenuWrapper>
        )}
      </Ul>
    </StyledNav>
  );
};

const Layout = ({ isLogin, isLoading, setIsLoading }) => {
  const currentUserId = firebase.auth.currentUser?.uid;
  const [userInfo, setUserInfo] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [active, setActive] = useState(null);

  console.log('layout', isLogin)
  useEffect(() => {
    if (!currentUserId) return;
    const unsubscribe = firebase.listenUserProfileChange(
      currentUserId,
      setUserInfo
    );

    return () => unsubscribe();
  }, [isLogin, currentUserId]);

  const props = {
    currentUserId,
    userInfo,
    chatOpen,
    setChatOpen,
    active,
    setActive,
  };

  // if (!currentUserId || !userInfo) return <Loader />

  return (
    <Container>
      <Nav
        isLogin={isLogin}
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
