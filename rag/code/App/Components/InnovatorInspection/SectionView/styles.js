import { StyleSheet } from 'react-native';
import { Colors, Metric } from '@Themes';

export const pickerStyle = {
  viewContainer: {
    alignSelf: null,
  },
};

const styles = StyleSheet.create({
  sectionContainer: {
    backgroundColor: 'white',
    borderRadius: 22,
    marginBottom: 16,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerContainer: {
    backgroundColor: 'white',
    padding: 5,
    // height: 44,
    borderRadius: 22,
    paddingHorizontal: Metric.space10,
    marginBottom: Metric.space10,
  },
  headerButton: {
    marginLeft: Metric.space5,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  sectionName: {
    marginRight: 5,
    fontWeight: '500',
  },
  moreIcon: {
    alignSelf: 'center',
  },
  moreButton: {
    height: 30,
  },
  btAdd: {
    marginTop: 5,
    marginLeft: 10,
    marginBottom: 10,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 16,
  },
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: '#FFFFFF99',
    opacity: 1.5
  }
});

export default styles;
