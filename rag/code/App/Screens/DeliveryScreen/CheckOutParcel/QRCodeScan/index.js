import React, { useState } from 'react';
import { Alert, Platform } from 'react-native';
import { CameraScreen } from 'react-native-camera-kit';
import { Metric, ImageResource } from '../../../../Themes';
import I18n from '@I18n';
import { Text, Button } from '../../../../Elements';
import { PERMISSIONS } from 'react-native-permissions';
import { requestPermission } from '../../../../Utils/permissions';
import styled from 'styled-components/native';

const width = Metric.ScreenWidth;
const height = Metric.ScreenHeight;

const ImageWrapper = styled.Image`
  width: 20px;
  height: 20px;
`;

const ScanView = styled.View`
  width: ${width - 100}px;
  margin-horizontal: 50px;
  height: 200px;
  border-width: 2px;
  border-color: #fff;
  position: absolute;
  top: ${(height - 200) / 2}px;
`;

const Title = styled(Text)`
  background-color: transparent;
  position: absolute;
  top: 100px;
  text-align: center;
  color: #fff;
  align-self: center;
  font-size: 20px;
  fontfamily: OpenSans-SemiBold;
`;
const Footer = styled.View`
  width: ${width};
  height: 90px;
  position: absolute;
  bottom: 0px;
  flex-direction: row;
  background-color: black;
`;

const FooterText = styled(Text)`
  color: #fff;
  margin-top: 10px;
  font-size: 15px;
`;

const ButtonClose = styled(Button)`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.View`
  flex: 1;
`;
const QRCodeScreen = ({ navigation }) => {
  const [isQRCodeScan, setIsQRCodeScan] = useState(true);
  const [isOpenCamera, setIsOpenCamera] = useState(false);
  const onGoBack = navigation.getParam('onGoBack');

  React.useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = () => {
    if (Platform.OS === 'android') {
      requestPermission(PERMISSIONS.ANDROID.CAMERA, () => {
        setIsOpenCamera(true);
      });
    } else {
      setIsOpenCamera(true);
    }
  };
  const scanDone = (qrCode) => {
    if (qrCode) {
      if (onGoBack) {
        onGoBack(qrCode);
        navigation.goBack();
      }
      navigation.replace('checkOutDelivery', { guid: qrCode });
    } else if (isQRCodeScan) {
      setIsQRCodeScan(false);
      Alert.alert(
        I18n.t('QRCODE_INCORRECT_TITLE'),
        I18n.t('QRCODE_INCORRECT_CONTENT'),
        [
          { text: I18n.t('QRCODE_DONT_SHOW_AGAIN'), onPress: () => console.log('Ask me later pressed') },
          {
            text: 'Cancel',
            onPress: () => setIsQRCodeScan(true),
            style: 'cancel',
          },
          { text: 'OK', onPress: () => setIsQRCodeScan(true) },
        ],
        { cancelable: false }
      );
    }
  };

  const onPressClose = () => {
    navigation.goBack();
  };
  return (
    <Wrapper>
      {isOpenCamera && (
        <CameraScreen
          styles={{ width: 100, height: 100 }}
          scanBarcode
          onReadCode={(event) => scanDone(event.nativeEvent.codeStringValue)}
          onReadQRCode={(event) => scanDone(event.nativeEvent.codeStringValue)}
        />
      )}

      <ScanView />
      <Title text={I18n.t(onGoBack ? 'TITLE_SCREEN_SCAN_BARCODE' : 'TITLE_SCREEN_SCAN_QRCODE')} />
      <Footer>
        <ButtonClose onPress={onPressClose}>
          <ImageWrapper source={ImageResource.IC_CloseWhite} />
          <FooterText>{I18n.t('CLOSE_SCAN_QRCODE')}</FooterText>
        </ButtonClose>
      </Footer>
    </Wrapper>
  );
};

export default QRCodeScreen;
