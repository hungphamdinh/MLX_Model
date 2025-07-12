/**
 * Created by thienmd on 10/7/20
 */
import { StyleSheet } from 'react-native';
import { Colors, Metric } from '@Themes';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E0EAF4',
    paddingHorizontal: 5,
    height: 20,
    borderRadius: 5,
    justifyContent: 'center',
    marginRight: Metric.Space,
  },
  title: {
    color: '#01132D',
  },
});

export default styles;
