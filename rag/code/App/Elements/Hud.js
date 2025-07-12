/**
 * Created by thienmd on 10/14/20
 */
import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import _ from 'lodash';
import Text from './Text';

function Hud(props) {
  // grab the props
  const { loading, message } = props;

  if (!loading) return null;
  return (
    <View style={styles.wrapper}>
      <View style={styles.hud}>
        <ActivityIndicator size="large" color="white" />
      </View>
      {_.size(message) > 0 && <Text text="INSPECTION_CREATE_DATABASE" />}
    </View>
  );
}

export const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    flex: 1,
    zIndex: 1,
  },
  hud: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 80,
    height: 80,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Hud;
