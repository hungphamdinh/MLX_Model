/* @flow */

import React, { useCallback, useState, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import NativeSplashScreen from 'react-native-splash-screen';
import { debounce } from 'lodash';
import { BasicStyles, ImageResource, Metric } from '../../Themes';
import { Image } from '../../Elements';
import useApp from '../../Context/App/Hooks/UseApp';
import RootChecker from '../../Components/RootChecker';

const SplashScreen = () => {
  const [isReady, setIsReady] = useState(false);
  const { bootstrapApp, bootstrapLanguage } = useApp();

  useEffect(() => {
    NativeSplashScreen.hide();
    // must have delay, because waiting for react-native-offline init
    bootstrapAppLanguage();
  }, []);

  const bootstrapAppLanguage = useCallback(
    debounce(async () => {
      await bootstrapLanguage();
      setIsReady(true);
    }, 300),
    []
  );

  if (!isReady) return null;

  return (
    <View style={BasicStyles.flexCenter}>
      <Image source={ImageResource.IMG_SplashScreen} style={styles.ImageBackground} />
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="blue" />
      </View>
      <RootChecker onCompleted={bootstrapApp} />
    </View>
  );
};

export default SplashScreen;
const styles = StyleSheet.create({
  ImageBackground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    top: 0,
    right: 0,
  },
  loading: {
    position: 'absolute',
    bottom: Metric.space60,
  },
  textUpdate: {
    marginTop: 20,
    color: 'blue',
    fontSize: 12,
  },
});
