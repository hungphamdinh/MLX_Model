import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

const useCountdown = (timeout = 1000, callback) => {
  const intervalIdRef = useRef(null);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, []);

  // stop interval when unmount
  useEffect(() => stopInterval, []);

  const startInterval = () => {
    if (intervalIdRef.current) {
      stopInterval();
    }

    intervalIdRef.current = setInterval(() => {
      callback();
    }, timeout);
  };

  const stopInterval = () => {
    clearInterval(intervalIdRef.current);
    intervalIdRef.current = null;
  };

  const handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'active') {
      if (!intervalIdRef.current) {
        startInterval();
      }
    } else {
      stopInterval();
    }
  };

  return {
    startInterval,
    stopInterval,
  };
};

export default useCountdown;
