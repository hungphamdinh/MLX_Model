import { StyleSheet } from 'react-native';
import { Colors } from '../../../Themes';

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 20,
    height: 40,
  },
  disabled: {
    backgroundColor: Colors.disabled,
    opacity: 0.8,
  },
  container: {
    flex: 1,
  },
  title: {
    flex: 1,
    color: 'black',
    marginRight: 5,
  },
  placeholder: {
    flex: 1,
    marginRight: 5,
    color: Colors.placeholder,
  },
  dropdownContent: {
    paddingHorizontal: 12,
    marginTop: 12,
  },
  dropdownIcon: {
    width: 20,
    height: 20,
  },
  itemTitle: {
    flex: 1,
  },
});

export default styles;
