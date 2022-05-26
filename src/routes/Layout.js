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
  useToast,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import styled from 'styled-components';
import Avatar from 'boring-avatars';
import PropTypes from 'prop-types';

import firebase from '../utils/firebase';
import logo from '../images/logo.png';
import { device, color } from '../style/variable';
import { useAuth } from '../contexts/AuthContext';
import Loader from '../components/Loader';

const Container = styled.div`
  height: auto;
  background-color: ${color.backgroundGray};
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
  display: none;
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
  display: none;
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
    firebase.signOut();
    navigate('/login', { state: { from: { pathname: '/notes' } } });
  };

  const handleLogIn = () => {
    navigate('/login', { state: { from: { pathname: '/notes' } } });
  };

  const goToProfile = () => {
    navigate(`/profile/${currentUserId}?tab=setting`);
  };

  console.log(userInfo);

  const tabs = [
    ['/notes', '我的筆記'],
    ['/practice', '面試練習'],
    ['/explore', '探索'],
    ['/messages', '聊天室'],
  ];

  return (
    <>
      <StyledNav>
        <Ul>
          <Link to="/notes">
            <Logo alt="logo" src={logo} />
          </Link>
          {tabs.map(tab => (
            <NavItem key={tab[0]}>
              <StyledNavLink to={tab[0]}>
                {({ isActive }) => <Span isActive={isActive}>{tab[1]}</Span>}
              </StyledNavLink>
            </NavItem>
          ))}
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
                <MenuItem onClick={goToProfile}>個人資料</MenuItem>
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
                      {tabs.map(tab => (
                        <MobileNavItem key={tab[0]}>
                          <StyledNavLink to={tab[0]}>
                            {({ isActive }) => (
                              <MobileSpan isActive={isActive}>
                                {tab[1]}
                              </MobileSpan>
                            )}
                          </StyledNavLink>
                        </MobileNavItem>
                      ))}
                      <MobileNavItem>
                        <StyledNavLink
                          to={`/profile/${currentUserId}?tab=setting`}
                        >
                          {({ isActive }) => (
                            <MobileSpan isActive={isActive}>
                              個人資料
                            </MobileSpan>
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

Nav.propTypes = {
  userInfo: PropTypes.object,
  currentUserId: PropTypes.string,
};

const Layout = () => {
  const { currentUserId, isLoading } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [active, setActive] = useState(null);
  const [companies, setCompanies] = useState(null);
  const [jobTitles, setJobTitles] = useState(null);
  const [databaseRooms, setDatabaseRooms] = useState([]);
  const [unreadTotal, setUnreadTotal] = useState(0);
  const [error, setError] = useState(null);

  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUserId) return;
    const unsubscribe = firebase.listenUserProfileChange(
      currentUserId,
      data => {
        setUserInfo(prev => {
          return { ...prev, ...data };
        });
      }
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

  useEffect(() => {
    if (error) {
      toast({
        title: `抱歉，${error.message}`,
        description: '將自動帶您回首頁',
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: error.type === 0 ? 'top' : 'top-right',
      });
      if (error.type === 0) {
        navigate('/notes');
      }
    }

    return () => setError(null);
  }, [error, navigate, toast]);

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
    setError,
  };

  if (isLoading) return <Loader isLoading={isLoading} />;

  return (
    <Container>
      <Nav userInfo={userInfo} currentUserId={currentUserId} />
      <ContentContainer>
        <Outlet context={props} />
      </ContentContainer>
    </Container>
  );
};

export default Layout;
