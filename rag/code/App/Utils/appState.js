import React, { useRef, useState, useEffect } from 'react';
import { AppState, StyleSheet, Text, View } from 'react-native';

export function useAppStateActive(onActiveFnc) {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, []);

  const _handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      setIsActive(true);
      if (onActiveFnc) {
        onActiveFnc();
      }
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
  };

  return isActive;
}
