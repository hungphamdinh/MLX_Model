/**
 * Created by thienmd on 10/7/20
 */

import { StyleSheet } from 'react-native';
import { Metric } from '@Themes';
import Colors from '../../../../Themes/Colors';

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    backgroundColor: 'white',
    paddingHorizontal: Metric.space10,
  },
  title: {
    fontWeight: 'bold',
  },
  selectedItem: {
    backgroundColor: 'gray',
    shadowColor: Colors.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    height: 50,
    elevation: 1,
  },
  contentContainer: {
    width: '100%',
    paddingBottom: 80,
    paddingTop: Metric.Space,
  },
  separator: {
    backgroundColor: Colors.border,
    flex: 1,
    height: 1,
  },
});

export default styles;
