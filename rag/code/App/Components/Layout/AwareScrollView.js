import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { StyleSheet } from 'react-native';
import React from 'react';
import { Metric } from '@Themes';

const AwareScrollView = ({ children, ...props }) => (
  <KeyboardAwareScrollView
    extraScrollHeight={60}
    showsVerticalScrollIndicator={false}
    keyboardShouldPersistTaps="handled"
    enableAutomaticScroll
    enableResetScrollToCoords={false}
    contentContainerStyle={styles.container}
    {...props}
  >
    {children}
  </KeyboardAwareScrollView>
);

export default AwareScrollView;

const paddingBottom = 100;
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    // backgroundColor: colors.athensGray,
    paddingBottom,
    paddingTop: 15,
  },
});
