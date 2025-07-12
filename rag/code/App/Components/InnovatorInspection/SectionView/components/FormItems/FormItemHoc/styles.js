/**
 * Created by thienmd on 10/19/20
 */
import { StyleSheet } from 'react-native';
import { Metric } from '@Themes';

export const iconButtonStyle = {
  container: {
    marginBottom: 10,
    alignItems: 'center',
  },
  name: {
    textAlign: 'center',
    fontWeight: '500',
  },
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
  },
  required: {
    color: 'red',
    fontSize: 16,
    fontWeight: '500',
  },
  titleContainer: {
    marginBottom: Metric.space15,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
  },
  bottomView: {
    marginBottom: Metric.space10,
  },
  addImageButton: {
    width: 60,
    height: 60,
    backgroundColor: '#FFF',
    elevation: 5,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.16,
  },
  addIcon: {
    width: 40,
    height: 40,
  },
  previewImage: {
    width: 60,
    height: 60,
    marginHorizontal: 5,
    borderRadius: 4,
  },
  swipeAbleButton: {
    width: 75,
    paddingHorizontal: 0,
    height: '100%',
  },
  wrapped: {
    flex: 1,
    marginRight: 10,
  },
  photoLocation: {
    marginTop: -7,
  },
  image: {
    width: 28,
    height: 35,
  },
  statusTag: {
    paddingHorizontal: 5,
    alignItems: 'center',
    marginLeft: 5,
  },
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: '#FFFFFF99',
    opacity: 1.5,
  },
});

export default styles;
