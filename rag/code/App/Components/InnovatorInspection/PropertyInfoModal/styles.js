import { StyleSheet } from 'react-native';
import { Metric } from '../../../Themes';

const styles = StyleSheet.create({
  scrollView: {
    // paddingBottom: 80,
  },
  topContainer: {
    marginHorizontal: 12,
  },
  propertyContainer: {
    marginBottom: Metric.Space,
    marginTop: Metric.Space,
    paddingBottom: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
    borderRadius: 20,
  },
  propertyImage: {
    width: '100%',
    aspectRatio: 3,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  name: {
    fontWeight: 'bold',
    marginBottom: Metric.space10,
  },
  informationContainer: {
    flex: 1,
    paddingVertical: Metric.space10,
    paddingHorizontal: 16,
  },
  memberSections: {
    flexWrap: 'wrap',
  },
  memberTag: {
    marginTop: Metric.space10,
  },
  container: {
    paddingHorizontal: 0,
    backgroundColor: 'white',
    marginBottom: 20,
  },
  topControlContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  separator: {
    height: 1,
    flex: 1,
    backgroundColor: '#ddd',
    marginTop: 16,
  },
  note: {},
  title: {
    color: '#5585C3',
    marginTop: 10,
    fontWeight: '500',
    marginLeft: 5,
    marginBottom: Metric.space10,
  },
  building: {
    width: 15,
    height: 15,
  },
  value: {
    marginLeft: 10,
    width: '80%'
  },
  contentWithLongLabel: {
    width: '70%'
  },
  label: {},
  bottomActions: {
    justifyContent: 'space-around',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 10,
  },
  propertyInfoModal: {
    marginHorizontal: -12,
  },
});

export default styles;
