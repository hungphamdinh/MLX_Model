import React, { useState, useEffect, useRef } from 'react';
import _ from 'lodash';
import { Hud } from '../../Elements';
import { useStateValue } from '../../Context';
import useSync from '../../Context/Sync/Hooks/UseSync';

const allowLoading = (state) => {
  const keys = _.keys(state);
  return keys.filter((key) => state[key].isLoading).length > 0;
};

const AppLoading = () => {
  const [state] = useStateValue();
  const {
    sync: { isFirstPull },
  } = useSync();

  // Raw loading state from state
  const isLoadingRaw = allowLoading(state);

  // Debounced loading state for UI
  const [showLoading, setShowLoading] = useState(false);

  // Use a ref to track the timer to avoid recreating effect on each render
  const timerRef = useRef(null);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Update loading state with optimized effect
  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // When loading starts, show immediately
    if (isLoadingRaw) {
      setShowLoading(true);
    } else {
      // When loading finishes, wait before hiding
      timerRef.current = setTimeout(() => {
        setShowLoading(false);
        timerRef.current = null;
      }, 200);
    }
  }, [isLoadingRaw]);

  return <Hud loading={showLoading} message={isFirstPull && 'INSPECTION_CREATE_DATABASE'} />;
};

export default React.memo(AppLoading);
