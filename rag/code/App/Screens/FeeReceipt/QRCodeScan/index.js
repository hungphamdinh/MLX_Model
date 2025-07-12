/* eslint-disable radix */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent */
import React, { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import I18n from '@I18n';
import styled from 'styled-components/native';
import { PERMISSIONS } from 'react-native-permissions';
import { Button, Text, Hud } from '@Elements';
import { CameraScreen } from 'react-native-camera-kit';
import { Metric, ImageResource, Colors } from '../../../Themes';
import ModalReceiptQRCode from '../../../Modal/ReceiptQRCode';
import useFee from '../../../Context/Fee/Hooks/UseFee';
import ModalSuccess from '../../../Components/ModalSuccess';
import { requestPermission } from '../../../Utils/permissions';
import useApp from '../../../Context/App/Hooks/UseApp';

const ImageWrapper = styled.Image`
  width: 20px;
  height: 20px;
  margin-bottom: 10px;
`;

const Title = styled(Text)`
  background-color: transparent;
  position: absolute;
  top: 100px;
  text-align: center;
  color: #fff;
  align-self: center;
  fontsize: 16px;
`;

const Wrapper = styled.View`
  flex: 1;
  background-color: black;
`;

const ScanView = styled.View`
  width: ${Metric.ScreenWidth - 100}px;
  margin-horizontal: 50px;
  height: 200px;
  border-width: 2px;
  border-color: #fff;
  position: absolute;
  top: ${(Metric.ScreenHeight - 200) / 2}px;
`;

const CloseWrapper = styled.View`
  width: ${Metric.ScreenWidth}px;
  height: 90px;
  position: absolute;
  bottom: 0px;
  flex-direction: row;
`;

const ButtonClose = styled(Button)`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const QRCodeScreen = ({ navigation }) => {
  const [receipt, setReceipt] = useState({
    code: '',
    feeType: '',
  });
  const [isOpenCamera, setIsOpenCamera] = useState(false);
  const [isScan, setIsScan] = useState(true);

  const {
    app: { notice },
  } = useApp();
  const {
    fee: { isLoading },
  } = useFee();

  const {
    fee: { isShowSuccessModal },
    closeSuccessModal,
  } = useFee();

  useEffect(() => {
    if (!notice) {
      setIsScan(true);
    }
  }, [notice]);

  useEffect(() => {
    if (!isShowSuccessModal && !receipt.code) {
      setIsScan(true);
    }
  }, [isShowSuccessModal]);

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

  const resetCode = () => {
    setReceipt({
      code: '',
    });
  };
  const scanDone = (url) => {
    const path = url.substring(url.lastIndexOfEnd('dynamic/'), url.indexOf('&') > -1 ? url.indexOf('&') : url.length);
    const indexOfSection = path.indexOf('/');
    const code = path.substring(indexOfSection + 1);
    const feeType = path.substring(0, indexOfSection);
    if (isScan) {
      setReceipt({
        code,
        feeType,
      });
      setIsScan(false);
    }
  };

  const onPressClose = () => {
    navigation.goBack();
  };

  const onCloseModalSuccess = () => {
    closeSuccessModal();
  };

  const onClosModalReceiptQR = () => {
    setIsScan(true);
  };

  const onPressCancel = () => {
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
      <Title color={Colors.textWhite} text={I18n.t('TITLE_SCREEN_SCAN_QRCODE')} />

      <CloseWrapper>
        <ButtonClose onPress={onPressClose}>
          <ImageWrapper source={ImageResource.IC_CloseWhite} />
          <Text fontSize={15} color={Colors.textWhite} text={I18n.t('CLOSE_SCAN_QRCODE')} />
        </ButtonClose>
      </CloseWrapper>
      <ModalReceiptQRCode
        resetCode={resetCode}
        receipt={receipt}
        onCancel={onPressCancel}
        onClose={onClosModalReceiptQR}
      />
      {isShowSuccessModal ? (
        <ModalSuccess
          titleButton={I18n.t('COMMON_CLOSE')}
          textContent={I18n.t('FEE_CHECK_RECEIPT_SUCCESS')}
          textTitle={I18n.t('MODAL_SUCCESS_TEXT_TITLE')}
          onPress={() => onCloseModalSuccess()}
        />
      ) : null}
      <Hud loading={isLoading} />
    </Wrapper>
  );
};

export default QRCodeScreen;
