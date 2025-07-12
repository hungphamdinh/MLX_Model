/**
 * Created by thienmd on 3/26/20
 */
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, ImageView, Text } from '@Elements';
import _ from 'lodash';
import { SelectImageOptionsModal } from '@Components';
import I18n from '@I18n';
import DocumentPicker from 'react-native-document-picker';

import styled from 'styled-components/native';
import FormControl, { useCommonFormController } from './FormControl';
import { images } from '../../Resources/image';
import { Colors } from '../../Themes';
import { icons } from '../../Resources/icon';
import ImageZoomModal from '../ImageZoomModal';
import useFile from '../../Context/File/Hooks/UseFile';

const ImageSlider = styled.ScrollView`
  padding-top: 10px;
`;

const ImageDisplayWrapper = styled.View`
  border-radius: 5px;
  border-width: 1px;
  border-color: #707070;
  width: 108px;
  height: 83px;
  border-style: dashed;
  align-items: center;
  justify-content: center;
`;

const PlaceHolderImage = styled.Image`
  width: 35px;
  height: 35px;
`;

const PlaceHolderText = styled(Text)`
  color: #3d3d3d;
  margin-top: 13px;
`;

const DeleteButton = styled.TouchableOpacity`
  position: absolute;
  top: -10px;
  right: 0px;
  z-index: 1;
`;

const CloseIcon = styled.Image`
  width: 20px;
  height: 20px;
`;

const UploadButton = styled(Button).attrs({
  containerStyle: {
    backgroundColor: Colors.azure,
    height: 37,
    marginTop: 35,
  },
})`
  color: white;
`;

const ImageDisplay = ({ files, onDeleteImage, isDelete = true, onPress }) => {
  if (_.size(files) > 0) {
    return (
      <ImageSlider horizontal>
        {files.map((source, index) => (
          <TouchableOpacity key={source.id || source.path} onPress={() => onPress(index)}>
            <ImageView source={source} style={styles.image} resizeMode="cover" />
            {isDelete && (
              <DeleteButton onPress={() => onDeleteImage(index)}>
                <CloseIcon source={icons.closeImage} />
              </DeleteButton>
            )}
          </TouchableOpacity>
        ))}
      </ImageSlider>
    );
  }
  return (
    <ImageDisplayWrapper>
      <PlaceHolderImage source={images.imagePlaceholder} resizeMode="contain" />
    </ImageDisplayWrapper>
  );
};

const FormImagePicker = ({ disabled, name, label, containerStyle, aspect, style, ...props }) => {
  const { setFieldValue, value, error } = useCommonFormController(name);
  const [zoomModalVisible, setZoomModalVisible] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  const { deleteFile } = useFile();
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

  const btAddPress = async () => {
    const res = await DocumentPicker.pickMultiple({
      type: [DocumentPicker.types.allFiles],
    });
  };

  const btPickPress = async () => {
    pickerRef.current?.shown(true);
  };

  const onSelectedImage = (medias) => {
    const list = [...value, ...medias];
    setFieldValue(list);
    pickerRef.current?.shown(false);
  };

  const onImagePress = (index) => {
    setZoomModalVisible(true);
    setImageIndex(index);
  };

  const onZoomModalClose = () => {
    setZoomModalVisible(false);
  };

  const onDeleteImage = (index) => {
    const deleteItem = index < (value || []).length ? value[index] : undefined;
    if (!deleteItem) {
      return;
    }
    if (deleteItem.id) {
      deleteFile(deleteItem.id);
    }
    value.splice(index, 1);
    setFieldValue(value);
  };
  const placeholder = I18n.t('COMMON_IMAGE_UPLOAD_LABEL');

  return (
    <FormControl error={error} style={containerStyle}>
      <View style={styles.container}>
        <ImageDisplay files={value} onPress={onImagePress} onDeleteImage={onDeleteImage} />
        {!disabled && (
          <>
            <PlaceHolderText text={placeholder} />
            <UploadButton rounded onPress={btPickPress} title="COMMON_UPLOAD" />
          </>
        )}
      </View>

      <SelectImageOptionsModal
        {...props}
        isDelete={disabled ? false : props.isDelete}
        ref={pickerRef}
        onSelectedImage={onSelectedImage}
      />
      <ImageZoomModal images={value} visible={zoomModalVisible} index={imageIndex} onClose={onZoomModalClose} />
    </FormControl>
  );
};

export default FormImagePicker;

const IMAGE_SIZE = 100;
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  emptyContainer: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
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
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    marginRight: 10,
  },
});
