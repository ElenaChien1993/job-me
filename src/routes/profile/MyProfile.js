import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { useOutletContext } from 'react-router-dom';
import styled from 'styled-components';
import Loader from '../../components/Loader';
import ProfileInfo from '../../components/ProfileInfo';

import ProfileRecords from '../../components/ProfileRecords';
import ProfileSetting from '../../components/ProfileSetting';
import { device, color } from '../../style/variable';

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
    width: 90%;
    @media ${device.mobileM} {
      margin: 0 auto;
    }
    @media ${device.tablet} {
      position: absolute;
      top: 235px;
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
              w={['50%', null, null, '12%']}
              p="5px"
              fontSize={['16px', null, null, null, '18px']}
              height="35px"
            >
              Setting
            </Tab>
            <Tab
              w={['50%', null, null, '12%']}
              p="5px"
              fontSize={['16px', null, null, null, '18px']}
              height="35px"
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
