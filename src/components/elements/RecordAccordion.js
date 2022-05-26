import {
  Button,
  Divider,
  IconButton,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
} from '@chakra-ui/react';
import styled from 'styled-components';
import { MdSaveAlt } from 'react-icons/md';
import PropTypes from 'prop-types';

import { color } from '../../style/variable';

const RecordsList = styled.div`
  width: 100%;
  height: 500px;
  background: #ffffff;
  border-radius: 20px;
  overflow: scroll;
  padding: 10px 20px;
`;

const Record = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  width: 90%;
  color: ${props => (props.isSelected ? 'black' : '#999999')};
  font-weight: ${props => (props.isSelected ? '700' : '400')};
  &:hover {
    font-weight: 700;
    color: black;
  }
  & h2 {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    font-size: 16px;
  }
  & p {
    text-align: end;
    max-width: 40px;
    font-size: 14px;
  }
`;

const SelectionWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const SectionTitle = styled.div`
  font-weight: 500;
  font-size: 16px;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
`;

const RecordAccordion = ({
  records,
  tabIndex,
  activeRecord,
  setActiveRecord,
  onOpen,
}) => {
  const handleDownload = async (url, name) => {
    const record = await fetch(url);
    const recordBlob = await record.blob();
    const recordURL = URL.createObjectURL(recordBlob);

    const anchor = document.createElement('a');
    anchor.href = recordURL;
    anchor.download = name;

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(recordURL);
  };

  return (
    <Accordion allowToggle>
      <RecordsList>
        {records.map(record => {
          return (
            <AccordionItem key={record.record_id}>
              <AccordionButton px={0} borderBottom="1px solid #dbdbdb">
                <Record
                  isSelected={
                    activeRecord && activeRecord.record_id === record.record_id
                  }
                  onClick={() => setActiveRecord(record)}
                >
                  <h2>{record.record_job}</h2>
                  <p>{record.date}</p>
                </Record>
                <AccordionIcon marginLeft="auto" />
              </AccordionButton>
              <AccordionPanel
                pt="15px"
                backgroundColor="rgba(243, 173, 95, 0.2)"
              >
                <>
                  <SelectionWrapper>
                    <SectionTitle>{record.record_name}</SectionTitle>
                    <Button
                      variant="outline"
                      borderColor={color.primary}
                      color={color.primary}
                      onClick={onOpen}
                      h="26px"
                      fontSize="14px"
                    >
                      刪除
                    </Button>
                  </SelectionWrapper>
                  <Divider mb="20px" />
                  <Content>
                    {tabIndex === 0 ? (
                      <audio
                        src={record.link}
                        controls
                        style={{ width: '100%', height: '40px' }}
                      />
                    ) : (
                      <video width="84%" src={record.link} controls />
                    )}
                    <IconButton
                      size="sm"
                      isRound
                      color="white"
                      colorScheme="brand"
                      aria-label="Save Recording"
                      fontSize="16px"
                      _hover={{
                        filter: 'brightness(150%)',
                      }}
                      onClick={() =>
                        handleDownload(record.link, record.record_name)
                      }
                      icon={<MdSaveAlt />}
                      ml="10px"
                    />
                  </Content>
                </>
              </AccordionPanel>
            </AccordionItem>
          );
        })}
      </RecordsList>
    </Accordion>
  );
};

RecordAccordion.propTypes = {
  records: PropTypes.array,
  tabIndex: PropTypes.number.isRequired,
  activeRecord: PropTypes.object.isRequired,
  setActiveRecord: PropTypes.func.isRequired,
  onOpen: PropTypes.func.isRequired,
};

export default RecordAccordion;
