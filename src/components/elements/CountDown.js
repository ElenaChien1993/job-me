import { useState, useRef, useEffect } from 'react';

const CountDown = ({ isStart, timer, setProgress }) => {
  const [remainingTime, setRemainingTime] = useState(timer);
  const [time, setTime] = useState('');
  const intervalRef = useRef();

  const second = 1;
  const minute = second * 60;
  console.log(remainingTime, isStart)

  useEffect(() => {
    if (!isStart) {
      const minutes = Math.floor(remainingTime / minute);
      const seconds = Math.floor((remainingTime % minute) / second);
      setTime({minutes, seconds})
      return;
    };
    intervalRef.current = setInterval(() => {
      console.log('interval?')
      setRemainingTime(prev => prev - 1);
      const minutes = Math.floor(remainingTime / minute);
      const seconds = Math.floor((remainingTime % minute) / second);

      if (remainingTime <= 0) {
        setProgress('finished');
        clearInterval(intervalRef.current);
      } else {
        console.log('countdown?')
        setTime({minutes, seconds})
      }
    }, 1000);
  }, [isStart]);

  return (
    <>
      <div>
        <span>{time.minutes > 9 ? time.minutes : '0' + time.minutes}</span> :{' '}
        <span>{time.seconds > 9 ? time.seconds : '0' + time.seconds}</span>
      </div>
    </>
  );
};

export default CountDown;
