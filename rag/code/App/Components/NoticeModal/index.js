// import liraries
import React, { useEffect } from 'react';
import { Dimensions, Image, Modal, StyleSheet, View } from 'react-native';
import I18n from '@I18n';
import { Button, Text } from '../../Elements';
import { Colors, Metric } from '../../Themes';
import useApp from '../../Context/App/Hooks/UseApp';
import { icons } from '../../Resources/icon';

const { width } = Dimensions.get('window');
export const noticeModalRef = React.createRef();

// create a itemLibrary
const NoticeModal = () => {
  const {
    app: { notice },
    setVisibleNotice,
  } = useApp();

  useEffect(() => {
    noticeModalRef.current = { setVisibleNotice };
  }, []);

  const isInitLanguage = I18n.languages.length > 0;

  if (notice) {
    const { message, isSuccess, callback } = notice;
    const closeModal = () => {
      setVisibleNotice(false);
      if (callback) {
        callback();
      }
    };

    return (
      <View style={styles.modal}>
        <View style={styles.ViewError}>
          <View style={styles.ViewErrorContain}>
            <Button onPress={closeModal} style={styles.ButtonClose}>
              <Image source={icons.close} />
            </Button>
            <Image source={isSuccess ? icons.success : icons.error} />
            {!isSuccess && (
              <Text style={styles.title} text={isInitLanguage ? I18n.t('REQUEST_ERROR_TITLE') : 'Error'} />
            )}
            <Text style={styles.content}>
              {isInitLanguage
                ? I18n.t(message || 'MODAL_ERROR_CONTENT')
                : 'An error occurred while loading. please try again'}
            </Text>
            <Button
              rounded
              primary
              containerStyle={styles.ButtonOk}
              title={isInitLanguage ? I18n.t('MODAL_ERROR_BUTTON', 'OK') : 'OK'}
              onPress={closeModal}
            />
          </View>
        </View>
      </View>
    );
  }
  return null;
};
// define your styles
const styles = StyleSheet.create({
  modal: {
    zIndex: 200222,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  ViewError: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
  },
  ViewErrorContain: {
    width: width - 40,
    borderRadius: 10,
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 40,
  },
  ButtonOk: {
    marginBottom: 0,
    minWidth: 150,
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  title: {
    marginTop: 15,
    fontSize: 15,
    fontFamily: 'OpenSans-bold',
    fontWeight: Metric.isANDROID ? 'bold' : null,
  },
  content: {
    marginTop: 15,
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 25,
    fontSize: 15,
  },
  ViewOk: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },
  TextOk: {
    fontSize: 15,
    color: '#FFFFFF',
    fontFamily: 'Opensans-SemiBold',
  },
  ButtonClose: {
    borderWidth: 1,
    borderColor: Colors.black,
    backgroundColor: Colors.bgWhite,
    borderRadius: 30,
    padding: 12,
    alignItems: 'center',
    position: 'absolute',
    top: -15,
    right: -7,
  },
});

export default NoticeModal;
