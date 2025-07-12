import React, { Fragment, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import _ from 'lodash';
import { IconButton, ImageView, CheckBox } from '@Elements';
import { Metric } from '@Themes';
import { CheckboxType } from '@Components/Forms/FormCheckBox';

const imageSize = Metric.ScreenWidth / 2 - 25;

const ImageItem = ({ selectMode, source, isView, onDeletePress, onEditImage, onSelect, checked }) => {
  const btEditPress = useCallback(
    _.debounce(() => {
      onEditImage();
    }, 500),
    [onEditImage]
  );
  return (
    <Fragment>
      <ImageView source={source} style={styles.image} />
      {!isView && (
        <>
          <IconButton containerStyle={styles.btEdit} onPress={btEditPress} name="create" size={25} color="white" />
          <IconButton name="close" color="white" size={15} onPress={onDeletePress} containerStyle={styles.btRemove} />
          {selectMode && (
            <CheckBox
              type={CheckboxType.circle}
              checked={checked}
              containerStyle={styles.checkBox}
              onPressCheck={onSelect}
            />
          )}
        </>
      )}
    </Fragment>
  );
};

const styles = StyleSheet.create({
  image: {
    width: imageSize,
    height: imageSize,
  },
  btRemove: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'red',
    width: 20,
    height: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    elevation: 1,
  },
  btEdit: {
    position: 'absolute',
    right: 30,
  },
  checkBox: {
    position: 'absolute',
    bottom: 5,
    right: 5,
  },
});

export default ImageItem;
