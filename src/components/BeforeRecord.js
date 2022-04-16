import { useState } from 'react';
import { Button, Select } from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import styled from 'styled-components';

import SwitchElement from './elements/Switch';

const PlayerWrapper = styled.div`
  margin-bottom: 20px;
`;

const TimerSettingWrapper = styled.div`
  display: flex;
  width: 40%;
  margin-bottom: 20px;
  justify-content: center;s
`;

const BeforeRecord = ({ recordType, timer, setTimer, setProgress }) => {
  const [isTimer, setIsTimer] = useState(true);

  return (
    <>
      <PlayerWrapper>
        {recordType === '錄音'
          ? '此次練習將以錄音方式進行'
          : '此次練習將以錄影方式進行'}
      </PlayerWrapper>
      <TimerSettingWrapper>
        <SwitchElement isTimer={isTimer} setIsTimer={setIsTimer} />
        {isTimer ? (
          <>
            <p>此題定時</p>
            <Select
              onChange={e => setTimer(e.target.value)}
              placeholder="請選擇計時時間"
            >
              <option value={30}>30 秒</option>
              <option value={60}>1 分鐘</option>
              <option value={90}>1 分半</option>
              <option value={120}>2 分鐘</option>
              <option value={180}>2 分半</option>
              <option value={240}>3 分鐘</option>
            </Select>
          </>
        ) : (
          <p>此題不定時（可自由結束，但回答時間最多為 3 分鐘）</p>
        )}
      </TimerSettingWrapper>
      <Button
        size="sm"
        onClick={() => setProgress('recording')}
        rightIcon={<ArrowForwardIcon />}
      >
        開始練習
      </Button>
    </>
  );
};

export default BeforeRecord;
