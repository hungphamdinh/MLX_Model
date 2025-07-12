import {StyleSheet} from 'react-native';
import { Colors } from '../../../../../../Themes';

const styles = StyleSheet.create({
  container: {

  },
  title: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    borderColor: Colors.border,
    borderWidth: 1,
  },
  active: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
});

export default styles;
