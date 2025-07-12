/**
 * Created by thienmd on 3/16/20
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';

const Row = ({ children, center, style = {}, ...props }) => (
  <View style={[styles.container, center && styles.center, style]} {...props}>
    {children}
  </View>
);

export default Row;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  center: {
    alignItems: 'center',
  },
});
