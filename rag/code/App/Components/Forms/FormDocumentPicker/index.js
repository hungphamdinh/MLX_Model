/**
 * Created by thienmd on 3/26/20
 */
import React, { Fragment, useEffect, useState } from 'react';
import { Alert, Platform, StyleSheet, View } from 'react-native';
import { Text, Box, IconButton } from '@Elements';
import I18n from '@I18n';
import useFile from '@Context/File/Hooks/UseFile';
import useApp from '@Context/App/Hooks/UseApp';
import { checkImageByMimeType, formatSizeUnits } from '@Utils/file';
import { Colors } from '@Themes';
import FileViewer from 'react-native-file-viewer';

import _ from 'lodash';
import { SelectImageOptionsModal } from '@Components';
import styled from 'styled-components/native';

import FormControl, { useCommonFormController } from '../FormControl';

import ImageZoomModal from '../../ImageZoomModal';
import DocumentItem from './DocumentItem';
import useFileSize from './useFileSize';
import { images } from '../../../Resources/image';

const DocumentDisplayWrapper = styled.View`
  border-radius: 5px;
  border-width: 1px;
  border-color: #707070;
  width: 108px;
  height: 83px;
  border-style: dashed;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
`;

const PlaceHolderImage = styled.Image`
  width: 35px;
  height: 35px;
`;

const PlaceHolderText = styled(Text)`
  color: #3d3d3d;
  flex: 1;
`;

const PlaceHolderTypeText = styled(Text)`
  color: #3d3d3d;
  flex: 1;
  margin-bottom: 15px;
`;

const validateDelete = (id, index, onDelete) => {
  if (!id) {
    onDelete(index);
    return;
  }
  Alert.alert(I18n.t('COMMON_DELETE'), I18n.t('DOCUMENT_DELETE_ASK'), [
    {
      text: I18n.t('AD_COMMON_NO'),
      style: 'cancel',
    },
    {
      text: I18n.t('AD_COMMON_YES'),
      onPress: () => onDelete(index),
    },
  ]);
};

const DocumentDisplay = ({ files, onDelete, allowDelete = true, onPress }) => {
  if (_.size(files) > 0) {
    return files.map((item, index) => (
      <DocumentItem
        key={item.id || item.tempId}
        item={item}
        allowDelete={allowDelete}
        onPress={() => onPress(index)}
        onDelete={() => validateDelete(item.id, index, onDelete)}
      />
    ));
  }

  return (
    <DocumentDisplayWrapper>
      <PlaceHolderImage source={images.imagePlaceholder} resizeMode="contain" />
    </DocumentDisplayWrapper>
  );
};

const FormDocumentPicker = ({
  name,
  label,
  containerStyle,
  aspect,
  style,
  disabled,
  documentsOfSameRecord,
  ...props
}) => {
  const { value, setFieldValue, error } = useCommonFormController(name);
  const {
    app: { allSettings, languageId },
  } = useApp();

  const fileSize = useFileSize({
    value,
    setFieldValue,
    allSettings,
    documentsOfSameRecord,
  });

  const [zoomModalVisible, setZoomModalVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(0);

  const { deleteFile, downloadAndViewDocument } = useFile();
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

  const pickerRef = React.useRef();

  const btPickPress = async () => {
    pickerRef.current?.shown(true);
  };

  const onSelectedImage = (medias) => {
    pickerRef.current?.shown(false);
    const list = [...value, ...medias];
    if (fileSize.checkTotalFileSize(list)) {
      setFieldValue(list);
    }
  };

  const onDocumentPress = (index) => {
    const item = value[index];
    const isImage = checkImageByMimeType(item.mimeType);
    setSelectedDocument(index);
    if (isImage) {
      setZoomModalVisible(true);
      return;
    }

    if (item.path) {
      FileViewer.open(item.path)
        .then(() => {
          // success
        })
        .catch((err) => {
          console.log('error open file', err);
        });
      return;
    }
    const url = `${item.urls || item.fileUrl}`;

    downloadAndViewDocument({ url, fileName: item.fileName });
  };

  const onZoomModalClose = () => {
    setZoomModalVisible(false);
  };

  const onDelete = (index) => {
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

  const getLimitFileUpload = () => {
    if (!allSettings?.fileStorageSetting) return null;

    const { maximumOfEachDocumentFile, maximumUploadOfImageFile } = allSettings?.fileStorageSetting;
    const getContent = (title, data) => I18n.t(title, undefined, formatSizeUnits(data));

    return (
      <Fragment>
        <PlaceHolderText text={getContent('MAX_FILE_SIZE_ALLOWED_UPLOAD', maximumOfEachDocumentFile)} />
        <PlaceHolderText text={getContent('MAX_IMAGE_SIZE_ALLOWED_UPLOAD', maximumUploadOfImageFile)} />
      </Fragment>
    );
  };

  const rightButton = !disabled ? (
    <IconButton name="add-circle" size={30} color={Colors.azure} onPress={btPickPress} />
  ) : null;

  return (
    <FormControl error={error} style={containerStyle}>
      <Box title={label || 'COMMON_DOCUMENT'} rightView={rightButton}>
        <View style={styles.container}>
          <DocumentDisplay files={value} onPress={onDocumentPress} onDelete={onDelete} allowDelete={!disabled} />
        </View>
        {getLimitFileUpload()}
        <PlaceHolderText text="FILE_TYPE_ALLOWED" />
        <PlaceHolderTypeText
          preset="medium"
          text={`.jpeg, .jpg, .gif, .png${props.onlyPickImage ? '' : ', .xlsx, .pdf, .doc, .docx., .csv'}. `}
        />
        <SelectImageOptionsModal languageId={languageId} {...props} ref={pickerRef} onSelectedImage={onSelectedImage} />
        <ImageZoomModal images={value} visible={zoomModalVisible} index={selectedDocument} onClose={onZoomModalClose} />
        {fileSize && fileSize.getFileSizeComponent()}
      </Box>
    </FormControl>
  );
};

export default FormDocumentPicker;

const IMAGE_SIZE = 100;
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 15,
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
