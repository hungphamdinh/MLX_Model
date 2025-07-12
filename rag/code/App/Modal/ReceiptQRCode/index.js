import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Clipboard } from 'react-native';
import { Button, Text } from '@Elements';
import I18n from '@I18n';
import { Metric, Fonts, ImageResource, Colors } from '../../Themes';
import FastImage from 'react-native-fast-image';
import { Modal } from '../../Components';
import { toast } from '../../Utils';
import useFee from '../../Context/Fee/Hooks/UseFee';

const ReceiptQRCode = ({
  onClose = () => { }, onCancel = () => { }, receipt = {}, resetCode
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { checkFeeReceipt } = useFee();

  const onCheckInApp = () => {
    checkFeeReceipt({
      code: receipt.code,
      feeType: receipt.feeType,
    });
    resetCode();
  };


  useEffect(() => {
    if (receipt.code) {
      setModalVisible(true);
    } else {
      setModalVisible(false);
    }
  }, [receipt.code]);

  const copyCode = () => {
    Clipboard.setString(receipt.code);
    toast.showSuccess(I18n.t('COMMON_COPY_TO_CLIP_BOARD'));
  };


  return (
    <Modal
      transparent
      animated
      visible={modalVisible}
    >
      <View style={styles.container}>
        <Button
          onPress={() => {
            resetCode();
            onClose();
          }}
          style={styles.ButtonClose}
        >
          <Image source={ImageResource.IC_Close} />
        </Button>
        <View style={styles.qrCodeView}>
          <FastImage source={ImageResource.IC_QR_CODE} style={{ width: 70, height: 70, marginBottom: 20 }} />
          <Text preset="bold" style={styles.title} text={I18n.t('FEE_CHECK_RECEIPT_MODAL_TITLE')} />
          <Button onPress={copyCode} style={{ flexDirection: 'row' }}>
            <Text style={styles.textCode} text={receipt.code} />
            <FastImage source={ImageResource.IC_Clip_Board} style={styles.clipboardIcon} tintColor={Colors.gray} />
          </Button>
        </View>
        <View style={styles.buttonView}>
          <Button
            rounded
            containerStyle={{ width: '40%' }}
            title={I18n.t('CANCEL')}
            light
            onPress={() => {
              resetCode();
              onCancel();
            }}
          />
          <Button primary rounded containerStyle={{ width: '55%' }} title={I18n.t('FEE_CHECK_RECEIPT_CHECK_IN_APP')} onPress={onCheckInApp} />
        </View>
      </View>
    </Modal>
  );
};


export default ReceiptQRCode;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    backgroundColor: Colors.bgWhite,
    marginHorizontal: 20,
    paddingTop: 30,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  qrCodeView: {
    alignItems: 'center',
    marginBottom: Metric.space30,
  },
  title: {
    marginBottom: Metric.space10,
    fontSize: 15,
  },
  buttonView: {
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'space-between',
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
  textCode: {
    textAlign: 'center',
    fontSize: 15,
  },
  clipboardIcon: { width: 15, height: 15, marginLeft: 5 },
});

