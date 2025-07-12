import { StyleSheet } from 'react-native';
import { Metric } from '@Themes';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 40,
    padding: 5,
    backgroundColor: 'white',
    paddingHorizontal: Metric.space10,
  },
  name: {
    marginLeft: Metric.Space,
    flex: 1,
  },
});

export default styles;
