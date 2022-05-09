import { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, NavLink } from 'react-router-dom';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import styled from 'styled-components';
import Avatar from 'boring-avatars';

import firebase from '../utils/firebase';
import logo from '../images/logo.png';
import { device, color } from '../style/variable';

const Container = styled.div`
  height: auto;
  background-color: ${color.demoBackground};
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
  background-color: ${color.primary};
  position: fixed;
  z-index: 5;
`;

const Ul = styled.ul`
  display: flex;
  height: 70px;
  align-items: center;
`;

const Logo = styled.img`
  width: 130px;
  margin: 10px 20px;
`;

const NavItem = styled.li`
  font-size: 16px;
  margin: 10px;
  @media ${device.mobileM} {
    display: none;
  }
  @media ${device.tablet} {
    display: block;
  }
`;

const ImageWrapper = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  margin-right: 13px;
  overflow: hidden;
  margin-right: 20px;
  cursor: pointer;
  @media ${device.mobileM} {
    display: none;
  }
  @media ${device.tablet} {
    display: block;
  }
`;

const StyledImg = styled.img`
  width: 40px;
  height: 40px;
  object-fit: cover;
`;

const LoginButton = styled.div`
  margin-left: auto;
  padding: 10px 30px;
  cursor: pointer;
  color: #999;
  font-weight: 500;
  &:hover {
    color: white;
    font-weight: 700;
  }
`;

const LogoutButton = styled.span`
  margin-top: 10px;
  padding: 0 5px;
  cursor: pointer;
  color: #999;
  font-weight: 700;
  &:hover {
    color: ${color.primary};
  }
`;

const StyledNavLink = styled(NavLink)`
  font-size: 16px;
  margin: 10px 5px;
`;

const Span = styled.span`
  color: ${props => (props.isActive ? 'white' : 'rgba(255, 255, 255, 0.7)')};
  font-weight: ${props => (props.isActive ? '700' : '500')};
  &:hover {
    color: white;
    font-weight: 700;
  }
`;

const MobileUl = styled.ul`
  display: flex;
  flex-direction: column;
`;

const MobileNavItem = styled.li`
  font-size: 16px;
  margin: 10px 20px;
`;

const MobileSpan = styled.span`
  color: ${props => (props.isActive ? color.primary : '#999')};
  font-weight: ${props => (props.isActive ? '700' : '500')};
  &:hover {
    color: ${color.primary};
    font-weight: 700;
  }
`;

const Nav = ({ userInfo, currentUserId }) => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleLogout = () => {
    firebase
      .signOut()
      .then(() => {
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
    <>
      <StyledNav>
        <Ul>
          <Link to="/notes">
            <Logo alt="logo" src={logo} />
          </Link>
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
                      size={40}
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
          {currentUserId && (
            <>
              <IconButton
                display={['block', null, null, 'none']}
                mr="20px"
                aria-label="Options"
                icon={<HamburgerIcon />}
                variant="outline"
                color="white"
                onClick={onOpen}
              />
              <Drawer
                size="xs"
                isOpen={isOpen}
                placement="right"
                onClose={onClose}
              >
                <DrawerOverlay />
                <DrawerContent>
                  <DrawerCloseButton />
                  <DrawerBody>
                    <MobileUl>
                      <MobileNavItem>
                        <StyledNavLink to="/notes">
                          {({ isActive }) => (
                            <MobileSpan isActive={isActive}>Notes</MobileSpan>
                          )}
                        </StyledNavLink>
                      </MobileNavItem>
                      <MobileNavItem>
                        <StyledNavLink to="/practice">
                          {({ isActive }) => (
                            <MobileSpan isActive={isActive}>
                              Practice
                            </MobileSpan>
                          )}
                        </StyledNavLink>
                      </MobileNavItem>
                      <MobileNavItem>
                        <StyledNavLink to="/messages">
                          {({ isActive }) => (
                            <MobileSpan isActive={isActive}>
                              Messages
                            </MobileSpan>
                          )}
                        </StyledNavLink>
                      </MobileNavItem>
                      <MobileNavItem>
                        <StyledNavLink to={`/profile/${currentUserId}`}>
                          {({ isActive }) => (
                            <MobileSpan isActive={isActive}>Profile</MobileSpan>
                          )}
                        </StyledNavLink>
                      </MobileNavItem>
                      <MobileNavItem>
                        <LogoutButton onClick={handleLogout}>登出</LogoutButton>
                      </MobileNavItem>
                    </MobileUl>
                  </DrawerBody>
                </DrawerContent>
              </Drawer>
            </>
          )}
        </Ul>
      </StyledNav>
    </>
  );
};

const Layout = () => {
  const currentUserId = firebase.auth.currentUser?.uid;
  const [userInfo, setUserInfo] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [active, setActive] = useState(null);
  const [companies, setCompanies] = useState(null);
  const [jobTitles, setJobTitles] = useState(null);
  const [databaseRooms, setDatabaseRooms] = useState([]);
  const [unreadTotal, setUnreadTotal] = useState(0);

  useEffect(() => {
    if (!currentUserId) return;
    const unsubscribe = firebase.listenUserProfileChange(
      currentUserId,
      setUserInfo
    );

    return () => unsubscribe();
  }, [currentUserId]);

  useEffect(() => {
    if (!currentUserId) return;
    const unsubscribe = firebase.listenRoomsChange(
      currentUserId,
      setDatabaseRooms
    );

    return () => unsubscribe();
  }, [currentUserId]);

  useEffect(() => {
    if (!currentUserId) return;
    const unreadQty = databaseRooms.reduce((acc, cur) => {
      if (cur.latest_sender === currentUserId) {
        return acc + 0;
      }
      return acc + (cur.unread_qty || 0);
    }, 0);
    setUnreadTotal(unreadQty);
  }, [databaseRooms, setUnreadTotal, currentUserId]);

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
    unreadTotal,
    setUnreadTotal,
    databaseRooms,
    setDatabaseRooms,
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
