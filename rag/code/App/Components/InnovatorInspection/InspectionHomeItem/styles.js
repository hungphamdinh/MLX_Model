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
    marginLeft: 12,
    paddingBottom: 15,
    marginBottom: 16,
    flex: 1,
  },
  subject: {
    width: '90%',
    marginHorizontal: 8,
  },
  image: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginBottom: Metric.space10,
  },
  propertyNameContainer: {
    marginTop: Metric.space10,
    marginHorizontal: 8,
  },
  building: {
    width: 15,
    height: 15,
  },
  title: {
    color: '#5585C3',
    fontWeight: '500',
    marginLeft: 5,
    flex: 1,
  },
  address: {
    marginTop: Metric.space10,
  },
  infoWrapper: {
    paddingHorizontal: 8,
  },
  statusIcon: {
    position: 'absolute',
    width: 32,
    height: 32,
    top: 12,
    right: 9,
  },
  btViewReport: {
    marginTop: 15,
    marginBottom: 0,
    height: 25,
  },
  tagWrapper: {
    position: 'absolute',
    top: 10,
  },
  inspectionTag: {
    paddingVertical: 2,
    paddingHorizontal: 15,
    marginBottom: 5,
  },
  tagTitle: {
    color: 'white',
    fontSize: 10,
  },
  viewReportContainer: {
    alignItems: 'center',
  },
  header: {
    justifyContent: 'space-between',
    marginBottom: 10,
    marginHorizontal: 8,
  },
  actionContainer: {
    justifyContent: 'flex-end',
    marginHorizontal: 8,
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  actionButton: {
    backgroundColor: Colors.primary,
    height: 25,
    borderRadius: 25,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
    marginTop: 10,
  },
  actionButtonTitle: {
    fontSize: 12,
  },
  disabledButton: {
    backgroundColor: Colors.disabled,
  },
  subjectWrapper: {
    justifyContent: 'space-between',
  },
  linkageWrapper: {
    marginLeft: 8,
  },
  jrLinkage: {
    color: 'blue',
  },
});

export default styles;
