import { Tabs, TabList, TabPanels, Tab, TabPanel, Button, Divider } from '@chakra-ui/react';
import { FaMicrophone, FaFilm } from "react-icons/fa";
import styled from 'styled-components';

const Container = styled.div`
  margin: 20px 10%;
  padding: 30px 0;
  display: flex;
  height: 100%;
`;

const LeftWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  border-right: 5px solid #c4c4c4;
  align-items: center;
  padding-right: 20px;
  width: 38%
`;

const RightWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 50px;
  width: 62%;
  height: 100%;
`;

const RecordsList = styled.div`
  width: 100%;
  height: 500px;
  padding-top: 20px;
  background: #FFFFFF;
  border-radius: 20px;
`

const Record = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  margin: 5px 0;
  cursor: pointer;
  color: ${(props) => (props.isSelected ? 'black' : '#999999')};
  font-weight: ${(props) => (props.isSelected ? '700' : '400')};
  & h2 {
    font-size: 30px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  & p {
    font-size: 18px;
  }
`

const SelectionWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const SectionTitle = styled.div`
  font-weight: 700;
  font-size: 24px;
  line-height: 33px;
`;

const Reminder = styled.div`
  color: red;
  font-size: 20px;
  text-align: center;
  margin-top: 30px;
`

const ProfileRecords = () => {

  return (
    <Container>
      <LeftWrapper>
        <Tabs w="100%" isFitted orientation="vertical" variant='solid-rounded' colorScheme='teal' size='lg'>
          <TabList mb='3em'>
            <Tab><FaMicrophone /></Tab>
            <Tab><FaFilm /></Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <RecordsList>
                <Record>
                  <h2>Record Name</h2>
                  <p>4/16</p>
                </Record>
                <Record>
                  <h2>Record Name</h2>
                  <p>4/16</p>
                </Record>
                <Record>
                  <h2>Record Name</h2>
                  <p>4/16</p>
                </Record>
              </RecordsList>
            </TabPanel>
            <TabPanel>
              <p>two!</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </LeftWrapper>
      <RightWrapper>
        <SelectionWrapper>
          <SectionTitle>Record Name</SectionTitle>
          <Button variant="outline" colorScheme="teal">刪除</Button>
        </SelectionWrapper>
        <Divider />
        <Reminder>檔案刪除後就無法再讀取，請記得先下載</Reminder>
      </RightWrapper>
    </Container>
  )
}

export default ProfileRecords