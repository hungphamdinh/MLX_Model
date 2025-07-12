import { StyleSheet } from 'react-native';
import { Metric, Colors } from '@Themes';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    // marginBottom: 20,
  },
  rowContainer: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    flex: 1,
  },
  infoContainer: {
    flex: 1,
    marginLeft: Metric.Space,
  },
  formName: {
    color: 'black',
    flex: 1,
  },
  statusContainer: {
    height: 25,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  status: {
    color: 'white',
  },
  nextContainer: {
    justifyContent: 'space-between',
  },
  imgNext: {
    transform: [{ rotate: '-180deg' }],
    width: 20,
    height: 20,
  },
  labelValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tag: {
    backgroundColor: Colors.statusVip,
    marginRight: -15,
    paddingHorizontal: 15,
  },
  tagLabel: {
    color: 'white',
    fontSize: 12,
  }
});

export default styles;

export const templateTypeStyle = StyleSheet.create({
  container: {
    alignSelf: 'center',
    borderRadius: 5,
    backgroundColor: '#d7e1f9',
    justifyContent: 'center',
    alignItems: 'center',
    width: 20,
    height: 130,
  },
  label: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2d61d3',
    width: 120,
    textAlign: 'center',
    alignSelf: 'center',
    transform: [{ rotate: '-90deg' }],
    textTransform: 'uppercase',
  },
});
