import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { useOutletContext } from 'react-router-dom';
import styled from 'styled-components';
import Loader from '../../components/Loader';
import ProfileInfo from '../../components/ProfileInfo';

import ProfileRecords from '../../components/ProfileRecords';
import ProfileSetting from '../../components/ProfileSetting';
import { device } from '../../style/device';

const Container = styled.div`
  height: 100%;
`;

const Upper = styled.div`
  background-color: #f5cdc5;
  border-bottom: 2px solid black;
  @media ${device.mobileM} {
    height: 100px;
  }
  @media ${device.tablet} {
    height: 200px;
  }
`;

const WebTitle = styled.div`
  font-weight: 700;
  font-size: 60px;
  line-height: 82px;
  color: black;
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
    position: absolute;
    width: 90%;
    @media ${device.mobileM} {
      top: 400px;
      justify-content: space-around;
    }
    @media ${device.tablet} {
      top: 218px;
      justify-content: flex-start;
    }
    @media ${device.laptop} {
      top: 213px;
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
    position: absolute;
    top: 100px;
    left: 50%;
    transform: translate(-50%, 0);
  }
  @media ${device.tablet} {
    display: none;
  }
`;

const MyProfile = () => {
  const { userInfo, currentUserId } = useOutletContext();

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
        <Tabs size="lg" isLazy variant="soft-rounded" colorScheme="brand">
          <StyledTabList>
            <Tab
              w={['50%', null, null, '20%']}
              p="5px"
              fontSize={['1.125rem', null, null, null, '1.3rem']}
            >
              Setting
            </Tab>
            <Tab
              w={['50%', null, null, '20%']}
              p={['5px', null, null, '0.75rem']}
              fontSize={['1.125rem', null, null, null, '1.3rem']}
            >
              Records
            </Tab>
          </StyledTabList>

          <TabPanels>
            <TabPanel>
              <ProfileSetting />
            </TabPanel>
            <TabPanel px={0}>
              <ProfileRecords />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Bottom>
    </Container>
  );
};

export default MyProfile;
