import { StyleSheet } from 'react-native';
import { Metric } from '@Themes';

const styles = StyleSheet.create({
  name: {
    fontWeight: 'bold',
    flex: 1,
  },
  status: {},
  infoContainer: {
    flex: 1,
  },
  statusContainer: {
    width: 60,
    height: 60,
    // backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Metric.Space,
  },
  statusIcon: {
    color: 'gray',
  },
  syncContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default styles;
