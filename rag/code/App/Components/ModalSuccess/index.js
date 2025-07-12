/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { View, StyleSheet, Dimensions, Image } from 'react-native';
import { Text, Button } from '../../Elements';
import { ImageResource } from '../../Themes';
import { Modal } from '..';

const { width, height } = Dimensions.get('window');
const ModalSuccess = ({ textTitle, textContent, titleButton, onPress, error }) => (
  <Modal style={Style.NoticeModal}>
    <View style={Style.ViewError}>
      <View style={Style.ViewErrorContain}>
        <Image source={error ? ImageResource.IC_WarningModal : ImageResource.IC_SuccessModal} />
        <Text style={Style.TextSory} text={textTitle} />
        <Text style={Style.ErrorMessage} text={textContent} />
        <Button
          onPress={() => {
            onPress();
          }}
          primary
          rounded
          title={titleButton}
        />
      </View>
    </View>
  </Modal>
);

const Style = StyleSheet.create({
  NoticeModal: {
    position: 'absolute',
    width,
    height,
    margin: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  ViewError: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ViewErrorContain: {
    width: width - 40,
    borderRadius: 10,
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    alignItems: 'center',
    padding: 20,
  },
  TextSory: {
    marginVertical: 15,
    // color: '#505E75',
    fontSize: 15,
    fontFamily: 'OpenSans-Bold',
  },
  ErrorMessage: {
    marginBottom: 20,
    // color: '#BABFC8',
    fontFamily: 'OpenSans-Regular',
    textAlign: 'center',
    fontSize: 15,
  },
  ButtonOk: {},
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
});

export default ModalSuccess;

