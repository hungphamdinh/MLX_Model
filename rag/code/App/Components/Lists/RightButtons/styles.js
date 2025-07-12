import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    height: '100%',
    width: '80%',
    justifyContent: 'space-evenly',
  },
});

export default styles;

export const swipeableButton = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 5,
    height: 44,
    width: 130,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 10,
    flexDirection: 'row',
  },
  title: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '700',
    marginLeft: 10,
  },
});
