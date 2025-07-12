import { StyleSheet } from 'react-native';
import { Colors } from '../../../../Themes';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
  },
  contentContainer: {
    flexGrow: 1,
    // backgroundColor: colors.athensGray,
    paddingBottom: 100,
  },
  addOnContainer: {
    borderRadius: 25,
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 15,
  },
  formName: {
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 25,
    borderWidth: 0,
  },
  required: {
    color: 'red',
    fontSize: 16,
  },
  btAdd: {
    marginHorizontal: 16,
  },
  buttonChangeHistory: {
    textAlign: 'right',
    marginRight: 10,
    marginTop: 5,
    marginBottom: 10,
    color: Colors.azure,
    textDecorationLine: 'underline'
  },
  wrapper: {
    flex: 1,
  }
});

export default styles;
