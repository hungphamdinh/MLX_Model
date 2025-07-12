/* @flow */

import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';

import { Colors } from '../../Themes';

type Props = {
  width?: number,
  height?: number,
  style?: Object,
  children?: Object
};

export default class PlaceHolder extends PureComponent<Props> {
  static defaultProps = {
    width: 40,
    height: 10,
  }

  render() {
    const {
      width, height, style, children,
    } = this.props;
    return (
      <View style={[styles.container, { width, height }, style]}>
        {children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.semiGray,
    borderRadius: 10,
  },
});
