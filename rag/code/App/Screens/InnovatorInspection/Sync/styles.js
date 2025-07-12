import { StyleSheet } from 'react-native';
import { Metric } from '../../../Themes';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
  },
  topControlContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  flatList: {
    flex: 1,
  },
  syncing: {
    marginTop: Metric.Space,
  },
  separator: {
    height: 20,
  },
});

export default styles;
