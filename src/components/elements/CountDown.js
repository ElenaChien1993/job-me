import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  font-size: 50px;
  font-weight: 700;
`;

const CountDown = ({ timer, status, stopRecording }) => {
  const [time, setTime] = useState('');
  const intervalRef = useRef();
  const timerRef = useRef(timer);

  const second = 1;
  const minute = second * 60;

  const countdownTimer = () => {
    timerRef.current -= 1;
    const minutes = Math.floor(timerRef.current / minute);
    const seconds = Math.floor((timerRef.current % minute) / second);

    if (timerRef.current <= 0) {
      stopRecording()
      clearInterval(intervalRef.current);
    } else {
      setTime({ minutes, seconds });
    }
  };

  useEffect(() => {
    if (status === 'idle') {
      timerRef.current = timer;
      const minutes = Math.floor(timer / minute);
      const seconds = Math.floor((timer % minute) / second);
      setTime({ minutes, seconds });
      clearInterval(intervalRef.current);
    } else if (status === 'recording') {
      intervalRef.current = setInterval(countdownTimer, 1000);
    } else if (status === 'paused' || status === 'stopped') {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [status]);

  return (
    <Container>
      <span>{time.minutes > 9 ? time.minutes : '0' + time.minutes}</span> :{' '}
      <span>{time.seconds > 9 ? time.seconds : '0' + time.seconds}</span>
    </Container>
  );
};

export default CountDown;
