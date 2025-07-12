import { StyleSheet } from 'react-native';
import { Colors, Metric } from '../../../Themes';

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 6.3,
    elevation: 10,
    marginHorizontal: 16,
    paddingBottom: 15,
    paddingTop: 10,
  },
  image: {
    width: '100%',
    aspectRatio: 3,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginBottom: Metric.space10,
  },
  building: {
    width: 15,
    height: 15,
  },
  title: {
    color: '#5585C3',
    fontWeight: '500',
    marginLeft: 5,
    marginBottom: Metric.space10,
  },
  totalInspection: {
    color: Colors.gray,
  },
  address: {
    marginBottom: Metric.space10,
    marginTop: Metric.space5,
    paddingRight: 16,
  },
  type: {},
  infoWrapper: {
    paddingLeft: 16,
  },
  rowWrapper: {
    justifyContent: 'space-between',
    flex: 1,
  },
  propertyTypeLabel: {
    paddingVertical: 5,
    flex: 0.27,
    alignItems: 'center',
    backgroundColor: 'orange',
  },
  propertyTypeText: {
    color: 'white',
  },
  propertyName: {
    flex: 0.68,
    marginTop: 10,
  },
});

export default styles;
