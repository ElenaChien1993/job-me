import { useState } from 'react';
import { Button } from '@chakra-ui/react';
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
            <div>
              <input value={timer} onChange={(e) => setTimer(e.target.value)} />
              <p>分鐘</p>
            </div>
          </>
        ) : (
          <p>此題不定時（回答時間上限為 3 分鐘）</p>
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
