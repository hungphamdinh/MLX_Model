import React from 'react';
import _ from 'lodash';
import { View, Platform, TouchableOpacity } from 'react-native';

const isAndroid = Platform.OS === 'android';

function processShadow(style) {
  if (isAndroid) {
    const { shadowColor, shadowOffset, shadowRadius, shadowOpacity, ...androidStyle } = style;
    return androidStyle;
  }
  return style;
}

const ShadowView = ({ style = [], onPress, ...restProps }) => {
  const defaultIOSStyle = {
    shadowColor: '#00000029',
    shadowOpacity: 1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  };

  const defaultAndroidStyle = {
    elevation: 6,
  };
  const defaultStyle = isAndroid ? defaultAndroidStyle : defaultIOSStyle;

  const styles = Array.isArray(style) ? style : [style];
  const appStyle = _.merge(defaultStyle, ...styles);
  const Wrapper = onPress ? TouchableOpacity : View;
  return <Wrapper {...restProps} onPress={onPress} style={processShadow(appStyle)} />;
};
export default ShadowView;
