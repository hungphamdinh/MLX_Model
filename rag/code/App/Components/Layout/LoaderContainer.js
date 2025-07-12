import React from 'react';
import { View, StyleSheet } from 'react-native';

const LoaderContainer = ({ isLoading, loadingComponent, children, style }) => (
  <View style={[styles.container, style]}>{isLoading ? loadingComponent : children}</View>
);

export default LoaderContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
