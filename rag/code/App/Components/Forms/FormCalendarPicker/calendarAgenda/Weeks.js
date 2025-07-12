import React from 'react';
import { View, Dimensions } from 'react-native';
import { Text } from '@Elements';

const width = Dimensions.get('window').width;
export default ({ language }) => {
  const weekLocalized = language;
  return (
    <View
      style={{
        width,
        height: 30,
        flexDirection: 'row',
      }}
    >
      {weekLocalized.map((day) => (
        <View
          style={{
            flex: 1,
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          key={day}
        >
          <Text
            style={{
              color: '#000',
              fontSize: 14,
            }}
          >
            {day}
          </Text>
        </View>
      ))}
    </View>
  );
};
