import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import styled from 'styled-components';

import ProfileRecords from '../../components/ProfileRecords';
import ProfileSetting from '../../components/ProfileSetting';

const Container = styled.div`
  background-color: #ffeade;
  height: 100%;
  padding-top: 70px;
`;

const Upper = styled.div`
  background-color: #f5cdc5;
  height: 200px;
`;

const WebTitle = styled.div`
  font-weight: 700;
  font-size: 60px;
  line-height: 82px;
  color: black;
  padding-left: 100px;
  padding-top: 50px;
`;

const StyledTabList = styled(TabList)`
  position: absolute;
  top: 226px;
  padding-left: 100px;
  width: 100%;
`

const Bottom = styled.div`
  height: 100%;
`;

const MyProfile = () => {
  return (
    <Container>
      <Upper>
        <WebTitle>Profile</WebTitle>
      </Upper>
      <Bottom>
        <Tabs size="lg" height="100%" isLazy>
          <StyledTabList>
            <Tab>Setting</Tab>
            <Tab>Records</Tab>
          </StyledTabList>

          <TabPanels height="100%">
            <TabPanel height="100%">
              <ProfileSetting />
            </TabPanel>
            <TabPanel height="100%">
              <ProfileRecords />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Bottom>
    </Container>
  );
};

export default MyProfile;
