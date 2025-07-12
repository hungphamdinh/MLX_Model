import React, { useState, useCallback, useEffect } from 'react';
import { IconButton, Hud } from '@Elements';
import Permissions, { PERMISSIONS } from 'react-native-permissions';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import RNFS from 'react-native-fs';
import { PermissionsAndroid, Platform } from 'react-native';
import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import _ from 'lodash';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import ImageScrollView from './Components/ImageScrollView';
import { ensureFolder, resizeImage } from '../../../../Utils/file';
import { requestPermission, requestLocationPermission } from '../../../../Utils/permissions';
import useInspection from '../../../../Context/Inspection/Hooks/UseInspection';
import { Metric } from '../../../../Themes';
import { generateInspectionUUID, TableNames } from '../../../../Services/OfflineDB/IDGenerator';
import { modal, toast } from '../../../../Utils';
import { openMultipleImagePicker } from '../../../../Elements/ImagePicker';
import { usePhotoEditor } from '../../../../Components/InnovatorInspection/PhotoEditor';
import useApp from '../../../../Context/App/Hooks/UseApp';
import { useRoute } from '@react-navigation/native';
import { Modules } from '../../../../Config/Constants';
import I18n from '../../../../I18n';
import { getPickerLanguageCode } from '../../../../Utils/language';

const Wrapper = styled.View`
  flex: 1;
  flex-direction: column;
`;

const BottomView = styled.View`
  position: absolute;
  bottom: 20px;
  width: ${Metric.ScreenWidth}px;
`;

const TopView = styled.SafeAreaView`
  justify-content: space-between;
  flex-direction: row;
  position: absolute;
  width: ${Metric.ScreenWidth - 30}px;
  left: 15px;
`;

const ActionWrapper = styled.SafeAreaView`
  flex-direction: row;
  justify-content: space-between;
  width: ${Metric.ScreenWidth - 30}px;
  left: 15px;
`;

const CircleButton = styled.TouchableOpacity`
  width: 70px;
  height: 70px;
  border-radius: 35px;
  background-color: rgba(0, 0, 0, 0.4);
  align-items: center;
  justify-content: center;
`;

const CameraView = styled(Camera)`
  position: absolute;
  top: 0px;
  right: 0px;
  left: 0px;
  bottom: 0px;
  flex: 1;
`;

const FocusView = styled.View`
  margin-top: -30px;
  margin-left: -30px;
  height: 80px;
  width: 80px;
  border-width: 1px;
  border-color: yellow;
  position: absolute;
  z-index: 2;
  pointer-events: none;
`;

const ActionButton = ({ onPress, name, size = 40, color = 'white', disabled = false }) => (
  <CircleButton disabled={disabled} onPress={onPress}>
    <Ionicons size={size} name={name} color={color} />
  </CircleButton>
);

const InspectionCamera = ({ navigation }) => {
  const {
    inspection: { locations, flashTurnOn },
    getLocations,
    switchCameraFlashStatus,
  } = useInspection();
  const { showPhotoEditor } = usePhotoEditor();
  const { showLoading } = useApp();
  const inspectionLoading = useInspection().inspection.isLoading;

  const {
    app: { languageId },
  } = useApp();

  const [data, setDataValue] = useState([]);
  const dataRef = React.useRef([]);
  const [openCamera, setOpenCamera] = useState(false);
  const [flashOn, setFlashOn] = useState(flashTurnOn);
  const [focusArea, setFocusArea] = useState(null);

  const device = useCameraDevice(
    'back',
    Metric.isIPProMax
      ? {
          physicalDevices: ['wide-angle-camera'],
        }
      : undefined
  );

  const [isLoading, setIsLoading] = useState(false);
  const {params} = useRoute();

  const images = params?.images;
  const onCompleted = params?.onCompleted;
  const isSurveyModule = params?.moduleId === Modules.SURVEY;

  const isRequiredLocation = navigation.getParam('isRequiredLocation');
  const isBelowAndroidVersion = (version) => Platform.OS === 'android' && Platform.Version < version;

  const cameraRef = React.useRef();

  React.useEffect(() => {
    const imageFolder = `${RNFS.DocumentDirectoryPath}/images`;
    ensureFolder(imageFolder);
    requestCameraPermission();
  }, []);

  React.useEffect(() => {
    if (isRequiredLocation && openCamera) {
      requestLocationPermission(getLocations);
    }
  }, [openCamera]);

  const setData = (newData) => {
    setDataValue(newData);
    dataRef.current = newData;
  };

  const handleCheckPermission = (permissionName, callBack) => {
    const permission = permissionName;
    Permissions.check(permission).then((response) => {
      if (response === 'denied' || response === 'blocked') {
        Permissions.request(permission).then((result) => {
          if (result === 'granted') {
            callBack();
          }
        });
      } else {
        callBack();
      }
    });
  };

  async function getImageLocations(images) {
    const imageLocations = [];
    images.forEach(() => {
      imageLocations.push(locations);
    });
    return imageLocations;
  }

  const openPicker = async () => {
    try {
      const resizedImages = await openMultipleImagePicker({
        androidLan: getPickerLanguageCode(languageId)
      });
      setIsLoading(true);
      let imageLocations = [];
      if (isRequiredLocation) {
        imageLocations = await getImageLocations(resizedImages);
      }

      setData([
        ...data,
        ...resizedImages.map(({ uri }, index) => ({
          uri,
          id: generateInspectionUUID(TableNames.formUserAnswerQuestionImage),
          location: imageLocations[index],
        })),
      ]);
    } catch (e) {
      toast.showError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onLibraryPress = async () => {
    if (isBelowAndroidVersion(33)) {
      handleCheckPermission(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, () => openPicker());
      return;
    }
    openPicker();
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      requestPermission(PERMISSIONS.ANDROID.CAMERA, () => {
        setOpenCamera(true);
      });
    } else {
      setOpenCamera(true);
    }
  };

  const requestPermissionSavePhoto = () => {
    if (isBelowAndroidVersion(30)) {
      handleCheckPermission(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, () => onCapturePress);
      return;
    }

    onCapturePress();
  };

  const onCapturePress = async () => {
    try {
      if (cameraRef) {
        const takePhotoOptions = {
          flash: flashOn ? 'on' : 'off',
        };

        const image = await cameraRef.current.takePhoto(takePhotoOptions);
        image.uri = image.path;
        setIsLoading(true);
        CameraRoll.save(image.uri);
        // resize image and move image to document folder
        const resizedImage = await resizeImage(image);
        setData([
          ...data,
          {
            id: generateInspectionUUID(TableNames.formUserAnswerQuestionImage),
            uri: resizedImage.uri,
            location: locations,
          },
        ]);
      }
    } catch (err) {
      console.log('err', err);
    } finally {
      setIsLoading(false);
    }
  };

  const onFlashPress = () => {
    const flashState = !flashOn;
    setFlashOn(flashState);
    switchCameraFlashStatus();
  };

  const onClosePress = () => {
    navigation.goBack();
  };

  const onDonePress = useCallback(
    _.debounce(() => {
      const totalImages = _.size(images) + _.size(data);
      const imageLimitation = 20;
      if (isSurveyModule && totalImages > imageLimitation) {
        modal.showError(I18n.t('SURVEY_IMAGE_LIMIT_EXCEEDED', undefined, imageLimitation))
        return;
      }
      const dataWithPos = data.map((item, index) => ({
        ...item,
        position: index + 1,
      }));
      onCompleted(dataWithPos);
      navigation.goBack();
    }, 500),
    [data, onCompleted, navigation]
  );

  const onRemoveImage = (id) => {
    setData(data.filter((image) => image.id !== id));
  };

  const onImageChanged = (newImage) => {
    const newData = _.cloneDeep(data);
    const index = newData.findIndex((image) => image.id === newImage.id);
    newData[index].uri = newImage.uri;
    setData(newData);
    showLoading(false);
  };

  const onFocus = ({ nativeEvent }) => {
    const pos = { x: nativeEvent.pageX, y: nativeEvent.pageY };
    cameraRef.current?.focus(pos);
    setFocusArea(pos);
    setTimeout(() => {
      setFocusArea(null);
    }, 3000);
  };

  const onEditImage = (image) => {
    showPhotoEditor(image, onImageChanged, onCancelEditImage);
  };

  const onCancelEditImage = () => {
    showLoading(false);
  };

  const loading = isLoading || inspectionLoading;
  return (
    <Wrapper onStartShouldSetResponder={onFocus}>
      {openCamera && device && (
        <CameraView
          photo
          focusable
          isActive
          device={device}
          supportsFocus
          enableZoomGesture
          ref={cameraRef}
          minZoom={0.5}
        />
      )}
      {focusArea && <FocusView style={{ top: focusArea.y, left: focusArea.x }} />}

      <TopView>
        <IconButton disallowInterruption name="close" onPress={onClosePress} size={35} color="white" />
        <IconButton name={flashOn ? 'flash' : 'flash-off'} onPress={onFlashPress} size={30} color="white" />
      </TopView>
      <BottomView>
        <ImageScrollView images={data} onRemoveImage={onRemoveImage} onEditImage={onEditImage} />
        <ActionWrapper>
          <ActionButton disabled={loading} name="image" onPress={onLibraryPress} />
          <ActionButton disabled={loading} name="camera" onPress={requestPermissionSavePhoto} />
          <ActionButton
            name="checkmark"
            onPress={onDonePress}
            disabled={_.isEmpty(data) || loading}
            color={_.isEmpty(data) ? 'gray' : 'white'}
          />
        </ActionWrapper>
      </BottomView>
      <Hud loading={isLoading || inspectionLoading} />
    </Wrapper>
  );
};

export default InspectionCamera;
