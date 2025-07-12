/**
 * Created by thienmd on 10/15/20
 */

import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Metric } from '../Themes';

const Group = ({ title, children }) => (
    <View style={styles.container}>
        <Text bold style={styles.title}>{title}</Text>
        <View style={styles.subContainer} >
            {children}
        </View>

    </View>
);

export default Group;

const styles = StyleSheet.create({
  container: {
    padding: Metric.space10,
    backgroundColor: 'white',
    borderRadius: Metric.borderRadius5,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 13,
    marginBottom: Metric.space10,
  },
  subContainer: {
  },
});
