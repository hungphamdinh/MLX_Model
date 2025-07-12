/**
 * Created by thienmd on 10/26/20
 */
import React from 'react';
import {StyleSheet, View} from 'react-native';

const Card = ({ children, style, ...restProps }) => (
    <View style={[styles.container, style]} {...restProps}>
        { children }
    </View>
);

export default Card;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderRadius: 14,
    backgroundColor: '#FFF',
    marginBottom: 15,
    marginHorizontal: 15,
    shadowColor: '#4A89E8',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 1,
  },
});
