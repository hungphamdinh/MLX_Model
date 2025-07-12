/* @flow */

import React, { useState, useEffect } from 'react';
import {
  Alert,
  View,
} from 'react-native';
import { CameraScreen } from 'react-native-camera-kit';
import { Button, Image, Text } from '../../../Elements';
import { ImageResource } from '../../../Themes';
import i18n from '@I18n';
import styles from './styles';

const QRScanAssets = ({navigation, onChangeScanQRCode}) => {
  const [isQRCodeScan, setIsQRCodeScan] = useState(true);

  const scanQRCode = (qrCode) => {
    const code = qrCode.slice(-15);
    const index = code.search('AS');
    if (index > -1) {
      onChangeScanQRCode(false);
      navigation.navigate('detailAssets', { assetCode: code });
    } else if (isQRCodeScan) {
      setIsQRCodeScan(false);
      Alert.alert(
        i18n.t('QRCODE_INCORRECT_TITLE'),
        i18n.t('QRCODE_INCORRECT_CONTENT'),
        [
          { text: i18n.t('QRCODE_DONT_SHOW_AGAIN'), onPress: () => console.log('Ask me later pressed') },
          {
            text: 'Cancel',
            onPress: () => setIsQRCodeScan(true),
            style: 'cancel',
          },
          { text: 'OK', onPress: () => setIsQRCodeScan(true) },
        ],
        { cancelable: false },
      );
    }
  };

  return (
      <View style={styles.wrapper}>
          <CameraScreen
            styles={styles.cameraWrapper}
            scanBarcode // THERE IS IMPORTANT
            onReadCode={event =>
            scanQRCode(event.nativeEvent.codeStringValue)}
            onReadQRCode={event =>
            scanQRCode(event.nativeEvent.codeStringValue)}
          />
          <View style={styles.spacingWrapper} />
          <Text style={styles.title}>{i18n.t('AD_PM_SCANQR_TITLE')}
          </Text>
          <View style={styles.footer}>
              <Button onPress={() => onChangeScanQRCode(false)} style={styles.buttonClose}>
                  <Image style={styles.iconClose} source={ImageResource.IC_CloseWhite} />
                  <Text style={styles.titleClose}>{i18n.t('AD_PM_SCANQR_CLOSE')}</Text>
              </Button>
          </View>
      </View>
  );
};

export default QRScanAssets;
