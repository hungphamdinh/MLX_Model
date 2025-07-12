import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import useUser from '../../../Context/User/Hooks/UseUser';

const useBackgroundTime = (sessionTimeout) => {
  const { setVisibleAuthConfirmModal } = useUser();
  const [appState, setAppState] = useState(AppState.currentState);
  const [lastBackgroundTime, setLastBackgroundTime] = useState(Date.now());

  const handleAppStateChange = (nextAppState) => {
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      const now = Date.now();
      const backgroundDuration = now - lastBackgroundTime;

      // Check if the background time exceeds the timeout
      if (backgroundDuration > sessionTimeout) {
        setVisibleAuthConfirmModal(true);
      }
    } else if (nextAppState.match(/inactive|background/)) {
      // Reset the last background time
      setLastBackgroundTime(Date.now());
    }
    setAppState(nextAppState);
  };

  useEffect(() => {
    // Subscribe to app state changes
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    // Unsubscribe from app state changes
    return () => {
      subscription.remove();
    };
  }, []);

  return null;
};

export default useBackgroundTime;
