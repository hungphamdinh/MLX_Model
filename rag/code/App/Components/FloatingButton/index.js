/* @flow */
import React, { PureComponent } from 'react';
import { Animated, StyleSheet, TouchableWithoutFeedback, View, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Text } from '../../Elements';

export default class FloatingButton extends PureComponent {
  render() {
    const { style } = this.props;
    const shadowStyle = Platform.OS === 'android' ? styles.shadowAndroid : styles.shadowIOS;
    const rotation = {
      transform: [
        {
          rotate: this.props.animation.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '45deg'],
          }),
        },
      ],
    };

    return (
      <View style={[styles.container, style]}>
        {this.props.children}

        <TouchableWithoutFeedback onPress={this.props.toggleMenu}>
          <Animated.View style={[styles.button, shadowStyle, styles.menu, rotation]}>
            <Text text="+" style={styles.plus} />
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 130,
    right: 15,
    alignItems: 'flex-end',
  },
  button: {
    width: 68,
    height: 68,
    borderRadius: 34,
    position: 'absolute',

    justifyContent: 'center',
    alignItems: 'center',
  },
  shadowIOS: {
    shadowColor: '#00000029',
    shadowOpacity: 1,
    shadowRadius: 26,
    shadowOffset: { width: 0, height: 3 },
  },
  shadowAndroid: {
    elevation: 6,
  },
  menu: {
    backgroundColor: '#FFE136',
  },
  plus: {
    fontSize: 45,
  },
});
