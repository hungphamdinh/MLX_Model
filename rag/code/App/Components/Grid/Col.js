/**
 * Created by thienmd on 3/16/20
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';

const Col = ({
  children, center, pl = 0, pr = 0, style = {}, ...props
}) => (
    <View
      style={[
      styles.container,
      center && styles.center,
      { paddingLeft: pl, paddingRight: pr },
      style,
    ]}
      {...props}
    >
        {children}
    </View>
);

export default Col;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    alignItems: 'center',
  },
});
