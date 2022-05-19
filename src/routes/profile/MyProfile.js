import { useState, useEffect } from 'react';
import {
  useNavigate,
  useOutletContext,
  useSearchParams,
} from 'react-router-dom';

import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import styled from 'styled-components';

import Loader from '../../components/Loader';
import ProfileInfo from '../../components/profile/ProfileInfo';
import ProfileRecords from '../../components/profile/ProfileRecords';
import ProfileSetting from '../../components/profile/ProfileSetting';
import { device, color } from '../../style/variable';
import useRWD from '../../hooks/useRWD';

const Container = styled.div`
  height: 100%;
`;

const Upper = styled.div`
  background-color: ${color.third};
  @media ${device.mobileM} {
    height: 100px;
  }
  @media ${device.tablet} {
    height: 200px;
  }
`;

const WebTitle = styled.div`
  font-weight: 700;
  font-size: 42px;
  line-height: 82px;
  color: ${color.primary};
  padding-left: 10%;
  padding-top: 50px;
  max-width: 1440px;
  margin: 0 auto;
  @media ${device.mobileM} {
    display: none;
  }
  @media ${device.tablet} {
    display: block;
  }
`;

const StyledTabList = styled(TabList)`
  && {
    @media ${device.mobileM} {
      margin: 0 auto;
      width: 90%;
    }
    @media ${device.tablet} {
      position: absolute;
      width: 100%;
      top: 235px;
      left: 0;
      padding-left: 10%;
      justify-content: flex-start;
    }
  }
`;

const Bottom = styled.div`
  height: 100%;
  margin: 0 auto;
  max-width: 1152px;
  @media ${device.mobileM} {
    width: 90%;
  }
  @media ${device.laptop} {
    width: 80%;
  }
`;

const InfoWrapper = styled.div`
  @media ${device.mobileM} {
    display: flex;
    flex-direction: column;
    align-items: center;
    transform: translate(0, -23%);
  }
  @media ${device.tablet} {
    display: none;
  }
`;

const MyProfile = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const { userInfo, currentUserId } = useOutletContext();
  let [searchParams, setSearchParams] = useSearchParams();
  let tab = searchParams.get('tab');
  const navigate = useNavigate();

  const isMobile = useRWD();

  useEffect(() => {
    if (tab !== 'setting' && tab !== 'records') {
      navigate('/notfound');
    }
    setTabIndex(() => (tab === 'setting' ? 0 : 1));
  }, [tab, navigate]);

  const handleTabsChange = index => {
    const value = index === 0 ? 'setting' : 'records';
    setSearchParams({ tab: value });
  };

  if (!userInfo) return <Loader />;

  return (
    <Container>
      <Upper>
        <WebTitle>Profile</WebTitle>
      </Upper>
      <Bottom>
        <InfoWrapper>
          <ProfileInfo userInfo={userInfo} currentUserId={currentUserId} />
        </InfoWrapper>
        <Tabs
          size="lg"
          isLazy
          variant={isMobile ? 'soft-rounded' : 'enclosed'}
          colorScheme="brand"
          index={tabIndex}
          onChange={handleTabsChange}
        >
          <StyledTabList>
            <Tab
              color="#999"
              w={['50%', null, null, '12%']}
              p="5px"
              fontSize={['16px', null, null, null, '18px']}
              height="35px"
              _selected={{
                color: isMobile ? 'white' : color.primary,
                borderColor: color.primary,
                borderBottomColor: color.third,
                fontWeight: 'bold',
                background: isMobile ? color.primary : color.backgroundGray,
              }}
            >
              Setting
            </Tab>
            <Tab
              color="#999"
              w={['50%', null, null, '12%']}
              p="5px"
              fontSize={['16px', null, null, null, '18px']}
              height="35px"
              _selected={{
                color: isMobile ? 'white' : color.primary,
                borderColor: color.primary,
                borderBottomColor: color.third,
                fontWeight: 'bold',
                background: isMobile ? color.primary : color.backgroundGray,
              }}
            >
              Records
            </Tab>
          </StyledTabList>

          <TabPanels>
            <TabPanel>
              <ProfileSetting />
            </TabPanel>
            <TabPanel px={0}>
              <ProfileRecords isMobile={isMobile} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Bottom>
    </Container>
  );
};

export default MyProfile;
