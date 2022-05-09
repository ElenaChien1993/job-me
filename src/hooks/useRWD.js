import { useState, useEffect } from 'react';

const useRWD = () => {
  const [isMobile, setIsMobile] = useState(true);

  const handleRWD = () => {
    if (window.innerWidth < 768) setIsMobile(true);
    else setIsMobile(false);
  };

  useEffect(() => {
    window.addEventListener('resize', handleRWD);
    handleRWD();
    return () => {
      window.removeEventListener('resize', handleRWD);
    };
  }, []);

  return isMobile;
};

export default useRWD;
