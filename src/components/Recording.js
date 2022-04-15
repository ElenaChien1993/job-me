import { useState } from 'react';
import { Button } from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import styled from 'styled-components';

import {Audio, Video} from './elements/MediaRecorder'
import CountDown from './elements/CountDown';

const Recording = ({timer, setProgress}) => {
  const [isStart, setIsStart] = useState(false);

  console.log(timer)
  return (
    <>
      <CountDown timer={timer} setProgress={setProgress} isStart={isStart}/>
      <Button
        size="sm"
        onClick={() => setIsStart(true)}
        rightIcon={<ArrowForwardIcon />}
      >
        開始答題
      </Button>
    </>
  )
}

export default Recording;