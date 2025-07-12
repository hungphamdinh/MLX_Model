/* @flow */

import React from 'react';
import 'react-native-get-random-values'; // need this to get secure random number in crypto-js
import { View } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { NetworkProvider } from 'react-native-offline';
import * as Sentry from '@sentry/react-native';
import DeviceInfo from 'react-native-device-info';
import { NetWork } from './Utils';
import NoticeModal from './Components/NoticeModal';
import { BasicStyles } from './Themes';
import { StateProvider } from './Context';
import { DSN_SENTRY, BUNDLE_ID } from './Config';
import RequestAuthModal from './Components/Auths/RequestAuthModal';
import ModalUpdateVersion from './Modal/ModalUpdateVersion';
import AppContainer from './Navigation';
import AppLoading from './Components/AppLoading';
import ErrorBoundary from './Components/ErrorBoundary';
import { zipCurrentLog } from './Services/LogService';
import DurationExpireModal from './Components/Auths/DurationExpireModal';

Sentry.init({
  dsn: DSN_SENTRY,
  // debug: true,
  release: `${BUNDLE_ID}@${DeviceInfo.getVersion()}+${DeviceInfo.getBuildNumber()}`,
  beforeSend: async (event, hint) => {
    const log = await zipCurrentLog();
    if (log) {
      hint.attachments = [{ filename: 'log.base64.json', data: [log] }];
    }
    return event;
  },
});

const App = () => {
  // const netInfo = useNetInfo();
  React.useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((networkState) => {
      NetWork.setConnected(networkState.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <View style={BasicStyles.flex}>
      <NetworkProvider>
        {/* <NetworkConsumer>{({ isConnected }) => NetWork.setConnected(isConnected)}</NetworkConsumer> */}
        <StateProvider>
          <ErrorBoundary>
            <RequestAuthModal>
              <AppContainer uriPrefix="/app" />
              <AppLoading />
              <DurationExpireModal />
            </RequestAuthModal>
            <NoticeModal />
            <ModalUpdateVersion />
          </ErrorBoundary>
        </StateProvider>
      </NetworkProvider>
    </View>
  );
};

export default __DEV__ ? App : Sentry.wrap(App);
