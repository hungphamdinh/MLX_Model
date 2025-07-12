/* @flow */
import { StyleSheet, Platform } from 'react-native';
import Color from './Colors'

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  flexAlign: {
    flex: 1,
    alignItems: 'center',
  },
  flexJustify: {
    flex: 1,
    justifyContent: 'center',
  },
  flexCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  alignCenter: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
  textAlign: {
    textAlign: 'center',
  },
  shadown: {
    ...Platform.OS === 'ios' ? {
      shadowColor: Color.colorMain,
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 0.16,
      shadowRadius: 15
    } : {
        elevation: 1
      }
  }
});

export default styles;
