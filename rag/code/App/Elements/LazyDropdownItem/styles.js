/**
 * Created by thienmd on 9/30/20
 */
import { StyleSheet } from 'react-native';
import { Colors } from '@Themes';

const borderRadius = 30;

export default StyleSheet.create({
  modalContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
  },
  dropdownContainer: {
    flex: 1,
    backgroundColor: Colors.bgMain,
  },
  smallWrapper: {
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    paddingHorizontal: 5,
    borderRadius,
    borderWidth: 1,
    borderColor: Colors.border,
    height: 32,
  },
  wrapper: {
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    paddingHorizontal: 5,
    borderRadius,
    height: 38,
  },
  disabled: {
    backgroundColor: Colors.disabled,
    opacity: 0.8,
  },
  container: {
    flex: 1,
  },
  title: {
    // flex: 1,
    color: 'black',
    marginRight: 5,
  },
  placeholder: {
    // flex: 1,
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
    marginRight: 5,
  },
  itemTitle: {
    flex: 1,
  },
  selectionItemContainer: {
    paddingVertical: 16,
  },
  flatList: {
    flex: 1,
  },
  icon: {
    marginRight: 8,
  },
  checkAll: {
    marginBottom: 0,
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
  },
  searchWrapper: {
    marginHorizontal: 16,
  },
  headerWrapper: {
    flex: 1,
  }
});
