/* eslint-disable no-extend-native */
/* @flow */

import React from 'react';
import { Linking, AppState } from 'react-native';
import NavigationService, { navigationRef } from '@NavigationService';
import { NavigationContainer } from '@react-navigation/native';
import _ from 'lodash';
import RootNavigation from './RootNavigation';
import { ReceiptType } from '../Config/Constants';
import { analytics } from '../Services/AnalyticService';

const AppContainer = () => {
  const routeNameRef = React.useRef('');
  const deepLinkConfig = {
    screens: {
      home: 'receipt/:code',
      // detailAssets: 'assets/:assetCode'
      // home: 'cashAdvanceReceipt/:cashAdvanceCode',
    },
  };

  function checkDeepLinkToUpdateParams(url, path, key) {
    const type = path.substring(0, path.indexOf('/'));
    if (url.includes(type) && type !== ReceiptType.FEE_RECEIPT) {
      deepLinkConfig.screens[key] = getLinkType(path, type, deepLinkConfig.screens[key]);
    }
  }

  const navigateDeepLink = (event) => {
    if (event.url && !event.url.includes('msauth')) {
      const { url } = event;
      const path = url.substring(url.lastIndexOfEnd('dynamic/'), url.indexOf('&') > -1 ? url.indexOf('&') : url.length);
      if (NavigationService.getCurrentRoute().name !== 'login') {
        checkDeepLinkToUpdateParams(url, path, 'home');
        NavigationService.linkTo(path, deepLinkConfig);
      } else {
        navigationRef.current.setParams({ url: event.url });
      }
    }
  };

  const getLinkType = (path, type, defaultValue) => {
    if (path.includes(type)) {
      return `${type}/:${type}Code`;
    }
    return defaultValue;
  };
  String.prototype.lastIndexOfEnd = function (string) {
    const io = this.lastIndexOf(string);
    return io === -1 ? -1 : io + string.length;
  };

  React.useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppState);
    const linkingSubscription = Linking.addEventListener('url', navigateDeepLink);
    return () => {
      subscription.remove();
      linkingSubscription.remove('url', navigateDeepLink);
    };
  }, []);

  const handleAppState = async (nextAppState) => {
    if (nextAppState === 'active') {
      if (await Linking.getInitialURL()) {
        Linking.emit('url');
      }
    }
  };
  return (
    <NavigationContainer
      ref={navigationRef}
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.current.getCurrentRoute().name;
        if (previousRouteName !== currentRouteName) {
          __DEV__ && console.log(currentRouteName);
          if (!_.isEmpty(currentRouteName)) {
            await analytics.logScreenView(currentRouteName);
          }
        }
        routeNameRef.current = currentRouteName;
      }}
      onReady={() => {
        routeNameRef.current = navigationRef.current.getCurrentRoute().name;
      }}
    >
      <RootNavigation />
    </NavigationContainer>
  );
};

export default AppContainer;
