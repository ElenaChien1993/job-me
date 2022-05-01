import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import styled from 'styled-components';

import ProfileRecords from '../../components/ProfileRecords';
import ProfileSetting from '../../components/ProfileSetting';

const Container = styled.div`
  height: 100%;
`;

const Upper = styled.div`
  background-color: #f5cdc5;
  height: 200px;
  border-bottom: 2px solid black;
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
`;

const StyledTabList = styled(TabList)`
  position: absolute;
  top: 218px;
  width: 100%;
`;

const Bottom = styled.div`
  height: 100%;
  margin: 0 auto;
  width: 80%;
  max-width: 1152px;
`;

const MyProfile = () => {
  return (
    <Container>
      <Upper>
        <WebTitle>Profile</WebTitle>
      </Upper>
      <Bottom>
        <Tabs size="lg" isLazy variant="soft-rounded" colorScheme="brand">
          <StyledTabList>
            <Tab>Setting</Tab>
            <Tab>Records</Tab>
          </StyledTabList>

          <TabPanels>
            <TabPanel>
              <ProfileSetting />
            </TabPanel>
            <TabPanel>
              <ProfileRecords />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Bottom>
    </Container>
  );
};

export default MyProfile;
