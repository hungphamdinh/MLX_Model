import React, { useState } from 'react';
import { Alert, Platform } from 'react-native';
import { CameraScreen } from 'react-native-camera-kit';
import I18n from '@I18n';
import { PERMISSIONS } from 'react-native-permissions';
import styled from 'styled-components/native';
import { Text, Button } from '../../Elements';
import { requestPermission } from '../../Utils/permissions';
import { Metric, ImageResource } from '../../Themes';
import useApp from '../../Context/App/Hooks/UseApp';

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
  top: 120px;
  text-align: center;
  color: #fff;
  align-self: center;
  font-size: 20px;
  font-family: OpenSans-SemiBold;
  margin-top: 20px;
`;
const Footer = styled.View`
  width: ${width}px;
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
const ScanQRCode = ({ navigation }) => {
  const [isOpenCamera, setIsOpenCamera] = useState(false);

  const {
    app: { notice, allowScanQRCode },
    setAllowScanQRCode,
  } = useApp();

  React.useEffect(() => {
    if (!notice) {
      setAllowScanQRCode(true);
    }
  }, [notice]);

  React.useEffect(() => {
    setAllowScanQRCode(true);
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
    const callback = navigation.getParam('callback');
    const notAllowGoBack = navigation.getParam('notAllowGoBack');

    let result = qrCode;
    const isScanDynamicLink = navigation.getParam('isScanDynamicLink');
    if (!allowScanQRCode) {
      return;
    }

    setAllowScanQRCode(false);

    if (isScanDynamicLink) {
      const path = qrCode.substring(
        qrCode.lastIndexOfEnd('dynamic/'),
        qrCode.indexOf('&') > -1 ? qrCode.indexOf('&') : qrCode.length
      );
      result = path.substring(path.indexOf('/') + 1);
    }

    if (result) {
      if (!notAllowGoBack) {
        navigation.goBack();
      }
      callback(result);
    } else if (allowScanQRCode) {
      Alert.alert(
        I18n.t('QRCODE_INCORRECT_TITLE'),
        I18n.t('QRCODE_INCORRECT_CONTENT'),
        [
          { text: I18n.t('QRCODE_DONT_SHOW_AGAIN') },
          {
            text: I18n.t('AD_COMMON_CANCEL'),
            onPress: () => setAllowScanQRCode(true),
            style: 'cancel',
          },
          { text: I18n.t('AD_COMMON_YES'), onPress: () => setAllowScanQRCode(true) },
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
      <Title text={I18n.t('TITLE_SCREEN_SCAN_QRCODE')} />
      <Footer>
        <ButtonClose onPress={onPressClose}>
          <ImageWrapper source={ImageResource.IC_CloseWhite} />
          <FooterText>{I18n.t('CLOSE_SCAN_QRCODE')}</FooterText>
        </ButtonClose>
      </Footer>
    </Wrapper>
  );
};

export default ScanQRCode;
