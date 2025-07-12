import React from 'react';
import { Animated, Easing } from 'react-native';
import { IconButton } from '@Elements';

const SyncButton = ({loading, onPress}) => {
  const [spinValue, setSpinValue] = React.useState(new Animated.Value(0));
  const loopAnimated = Animated.loop(Animated.timing(
    spinValue,
    {
      toValue: 1,
      duration: 3000,
      easing: Easing.linear,
      useNativeDriver: true,
    },
  ));

  React.useEffect(() => {
    if (loading) {
      loopAnimated.start();
      return;
    }
    setSpinValue(new Animated.Value(0));

    loopAnimated.stop();
  }, [loading]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
      <Animated.View style={{transform: [{rotate: spin}] }}>
          <IconButton
            name="sync-outline"
            color={loading ? 'gray' : '#558CC9'}
            size={25}
            disabled={loading}
            onPress={onPress}
          />
      </Animated.View>

  );
};

export default SyncButton;
