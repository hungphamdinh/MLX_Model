import React from 'react';
import { View } from 'react-native-animatable';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from '../../../Elements';
import { Metric } from '../../../Themes';

const FilterCheckBox = ({ onPress, name, isCheck, color }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      flexDirection: 'row',
      marginTop: Metric.space10,
      alignItems: 'center',
      width: '50%',
    }}
  >
    <View style={styles.checkBoxWrapper}>
      {isCheck && <Ionicons size={18} name="checkmark-outline" color="black" />}
    </View>
    {color && <View style={[styles.status, { backgroundColor: color }]} />}

    <Text preset="bold" style={{ marginLeft: 10 }}>
      {name}
    </Text>
  </TouchableOpacity>
);

export default FilterCheckBox;

const styles = StyleSheet.create({
  checkBoxWrapper: {
    borderWidth: 0.5,
    width: 20,
    height: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  status: {
    width: 14,
    height: 14,
    borderRadius: 5,
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    elevation: 5,
  },
});
