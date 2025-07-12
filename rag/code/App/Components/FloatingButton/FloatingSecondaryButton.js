/* @flow */
import React, { useState } from 'react';
import { View, StyleSheet, Animated, TouchableWithoutFeedback } from 'react-native';
import { Text } from '@Elements';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../Themes/Colors';

const FloatingSecondaryButton = ({ yPosition, title, animation, icon, onPress }) => {
  const [translateYAnimate] = useState({
    transform: [
      { scale: animation },
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, yPosition || 0],
        }),
      },
    ],
  });
  const [opacity] = useState(
    animation.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0, 1],
    })
  );

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <Animated.View style={[styles.button, translateYAnimate, opacity]}>
        <View style={styles.buttonIconText}>
          <IconMaterial name={icon} size={24} color={Colors.success} />
          <Text preset="medium" style={{ textAlign: 'center', paddingLeft: 5 }}>
            {title}
          </Text>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00000029',
    shadowOpacity: 1,
    shadowRadius: 26,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
    height: 38,
    borderRadius: 19,
    marginBottom: 5,
    paddingLeft: 12,
    paddingRight: 12,
    backgroundColor: '#FFE136',
    color: Colors.bgGreen,
  },
  buttonIconText: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default React.memo(FloatingSecondaryButton);
