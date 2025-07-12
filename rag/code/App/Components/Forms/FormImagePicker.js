/**
 * Created by thienmd on 3/26/20
 */
import React, { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Button, Image, ImageView, Text } from '@Elements';
import { SelectImageOptionsModal } from '@Components';
import I18n from '@I18n';

import FormControl, { useCommonFormController } from './FormControl';
import { ImageResource } from '../../Themes';

const ImageViewer = ({ source, disabled }) => {
  if (source) {
    return <ImageView source={source} style={styles.image} />;
  }
  return (
    <View style={styles.emptyContainer}>
      <Image source={ImageResource.IC_camera} style={styles.emptyIcon} resizeMode="contain" />
      {!disabled && <Text style={styles.emptyTitle} text={I18n.t('COMMON_ADD_PHOTO')} />}
    </View>
  );
};

const FormImagePicker = ({ name, label, containerStyle, aspect, style, disabled, ...props }) => {
  const { value, setFieldValue, error } = useCommonFormController(name);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    getPermissionAsync();
  });

  const getPermissionAsync = async () => {
    if (Platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  };

  const pickerRef = React.createRef();

  // const btPickPress = async () => {
  //   const pickerOptions = {
  //     width: 500,
  //     height: 500,
  //     cropping: true,
  //   }
  //   ImageCropPicker.openCamera(pickerOptions).then((image) => {
  //     setFieldValue(image.uri);
  //   });
  // };
  const btPickPress = async () => {
    pickerRef.current?.shown(true);
  };

  const onSelectedImage = (images) => {
    let image = images;
    if (props.multiple === false) {
      image = images[0];
    }
    setFieldValue({
      ...image,
      file: image.path,
    });
    pickerRef.current?.shown(false);
  };

  // let uri = value;
  // if (_.isObject(value)) {
  //   uri = value.path;
  // }

  return (
    <FormControl error={error} style={containerStyle}>
      <View style={styles.container}>
        <Button activeOpacity={disabled ? 1 : 0} onPress={disabled ? undefined : btPickPress}>
          <ImageViewer disabled={disabled} source={value} />
        </Button>
      </View>

      <SelectImageOptionsModal {...props} ref={pickerRef} onSelectedImage={onSelectedImage} />
    </FormControl>
  );
};

export default FormImagePicker;

const WIDTH_HEIGHT = 100;
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  emptyContainer: {
    width: WIDTH_HEIGHT,
    height: WIDTH_HEIGHT,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    width: 60,
    height: 60,
  },
  emptyTitle: {
    marginTop: 10,
  },
  image: {
    width: WIDTH_HEIGHT,
    height: WIDTH_HEIGHT,
  },
});
