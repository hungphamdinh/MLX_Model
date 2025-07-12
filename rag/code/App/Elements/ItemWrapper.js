/* @flow */

import React from 'react';
import { View, StyleSheet } from 'react-native';

import { Colors, Metric } from '../Themes';
import Button from './Button';

type Props = {
  style?: any,
  contentContainerStyle?: any,
  children?: any,
  onPress?: Function,
  onLayout?: Function
};

export default class ItemWrapper extends React.PureComponent<Props> {
  static defaultProps = {
    style: null,
    contentContainerStyle: null,
    children: null,
  };

  render() {
    const {
      children, onPress, style, contentContainerStyle, onLayout, disabled
    } = this.props;
    return (
      <Button
        style={[styles.itemWrapper, style]}
        onPress={onPress}
        disabled={disabled}
        onLayout={onLayout}
      >
        <View style={[styles.itemContainer, contentContainerStyle]}>
          {children}
        </View>
      </Button>
    );
  }
}

const styles = StyleSheet.create({
  itemWrapper: {
    marginHorizontal: Metric.Space,
    marginBottom: Metric.space10,
    backgroundColor: Colors.bgWhite,
    borderRadius: Metric.borderRadius10,
  },
  itemContainer: {
    margin: Metric.Space,
  },
});
