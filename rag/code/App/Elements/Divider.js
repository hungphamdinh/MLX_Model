/**
 * Created by thienmd on 10/26/20
 */
import React from 'react';
import {StyleSheet, View} from 'react-native';
import { Colors } from '../Themes';

const Divider = ({ color = Colors.semiGray, containerStyles }) => {
    const divideStyles = () => ({
            ...styles.container,
            backgroundColor: color,
        });
    return (
        <View style={[divideStyles(), containerStyles]} />
    );
};

export default Divider;

const styles = StyleSheet.create({
  container: {
    height: 1,
  },
});
