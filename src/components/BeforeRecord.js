import { useState } from 'react';
import { Button, Icon, Select, useToast } from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import { MdTimer } from 'react-icons/md';
import styled from 'styled-components';

import SwitchElement from './elements/Switch';
import { device, color } from '../style/variable';

const PlayerWrapper = styled.div`
  margin-bottom: 20px;
  @media ${device.mobileM} {
    font-size: 1.2rem;
  }
  @media ${device.tablet} {
    font-size: 1.5rem;
  }
`;

const TimerSettingWrapper = styled.div`
  display: flex;
  margin-bottom: 20px;
  justify-content: space-around;
  align-items: center;
  border-radius: 20px;
  padding: 20px;
  background-color: ${color.white};
  @media ${device.mobileM} {
    width: 340px;
    height: 180px;
  }
  @media ${device.tablet} {
    width: 450px;
    height: 140px;
  }
`;

const Text = styled.div`
  font-size: 1.2rem;
`;

const SelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const BeforeRecord = ({ recordType, timer, setTimer, setProgress }) => {
  const [isTimer, setIsTimer] = useState(true);
  const toast = useToast();

  const handleStart = () => {
    if (timer === '') {
      toast({
        title: '哎呀',
        description: '請選擇計時時間或是選擇不定時',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      return;
    }
    if (!isTimer) {
      setTimer(180);
    }
    setProgress('recording');
  };

  return (
    <>
      <PlayerWrapper>
        {recordType === '錄音'
          ? '此次練習將以錄音方式進行'
          : '此次練習將以錄影方式進行'}
      </PlayerWrapper>
      <TimerSettingWrapper>
        <Icon as={MdTimer} boxSize="5rem" mr="20px" />
        {isTimer ? (
          <SelectWrapper>
            <Text>此題定時</Text>
            <Select
              mt="10px"
              onChange={e => setTimer(e.target.value)}
              placeholder="請選擇計時時間"
              isRequired
              colorScheme="brand"
            >
              <option value={30}>30 秒</option>
              <option value={60}>1 分鐘</option>
              <option value={90}>1 分半</option>
              <option value={120}>2 分鐘</option>
              <option value={150}>2 分半</option>
              <option value={180}>3 分鐘</option>
            </Select>
          </SelectWrapper>
        ) : (
          <Text>
            此題不定時
            <br />
            （可自由結束，但回答時間最多為 3 分鐘）
          </Text>
        )}
        <SwitchElement isTimer={isTimer} setIsTimer={setIsTimer} />
      </TimerSettingWrapper>
      <Button
        colorScheme="brand"
        onClick={handleStart}
        rightIcon={<ArrowForwardIcon />}
      >
        開始練習
      </Button>
    </>
  );
};

export default BeforeRecord;
