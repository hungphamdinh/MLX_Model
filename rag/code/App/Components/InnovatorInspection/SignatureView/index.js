/**
 * Created by thienmd on 10/5/20
 */

import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Button, ImageView } from '@Elements';
import RNFS from 'react-native-fs';
import styled from 'styled-components/native';
import I18n from '@I18n';
import RNSketchCanvas from '@gigasz/react-native-sketch-canvas';
import { Colors, Metric } from '@Themes';
import { generateGUID } from '@Utils/number';
import { ensureFolder } from '@Utils/file';

const SignatureImage = styled(ImageView)`
  width: ${Metric.ScreenWidth}px;
`;

const SignatureView = ({
  name,
  isAddNew,
  setSaveFnc,
  onPathChange,
  onSignatureSaved,
  setFieldValue,
  value,
  ...restProps
}) => {
  const [loadingImage, setLoadingImage] = useState(false);
  const haveImage = value.fileUrl || value.localPath;
  const imageUrl = value.localPath ? { path: `file://${value.localPath}` } : value;

  const signatureRef = React.createRef();
  const onClearPressed = () => {
    if (!value.fileUrl) {
      signatureRef.current.clear();
    }
    setFieldValue('fileUrl', '');
    setFieldValue('localPath', '');
    onPathChange();
  };

  const save = () => {
    signatureRef.current.save();
  };
  setSaveFnc(save);

  const onSaved = async (path) => {
    try {
      const signatureFolder = `${RNFS.DocumentDirectoryPath}/signatures`;
      const destPath = `${signatureFolder}/${generateGUID()}.jpg`;
      await ensureFolder(signatureFolder);
      // move this signature to document directory, cause in tmp folder, the ios will auto delete it any time and we don't want to loose our data
      await RNFS.moveFile(path, destPath);
      const params = { path: value.fileUrl || destPath, name };
      onSignatureSaved(params);
    } catch (e) {
      console.log('on saved error', e);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.signature}>
        <RNSketchCanvas
          {...restProps}
          ref={signatureRef}
          containerStyle={styles.signature}
          canvasStyle={styles.canvas}
          defaultStrokeIndex={0}
          defaultStrokeWidth={3}
          savePreference={() => ({
            folder: 'RNSketchCanvas',
            filename: String(Math.ceil(Math.random() * 100000000)),
            transparent: false,
            includeImage: false,
            includeText: false,
            cropToImageSize: false,
            imageType: 'jpg',
          })}
          onSketchSaved={(success, path) => {
            onSaved(path);
          }}
          onPathsChange={(pathsCount) => {
            console.log('on path change', pathsCount);
          }}
        />
        {haveImage ? (
          <View style={styles.signatureImageWrapper}>
            <SignatureImage
              onLoadStart={() => setLoadingImage(true)}
              onLoadEnd={() => setLoadingImage(false)}
              cache="none"
              source={imageUrl}
              resizeMode="contain"
              style={styles.signatureImage}
            />
            {loadingImage && (
              <ActivityIndicator style={{ alignSelf: 'center', marginTop: -120 }} color="gray" size="large" />
            )}
          </View>
        ) : null}
      </View>

      {isAddNew && (
        <Button
          danger
          containerStyle={styles.clearButton}
          title={I18n.t('AD_CLEAR_SIGNATURE')}
          onPress={onClearPressed}
        />
      )}
    </View>
  );
};

export default SignatureView;

const styles = StyleSheet.create({
  container: {
    // marginBottom: 20,
  },
  signature: {
    width: '100%',
    backgroundColor: Colors.bgWhite,
    borderRadius: 20,
    aspectRatio: 4 / 3,
  },
  signatureImageWrapper: {
    position: 'absolute',
  },
  signatureImage: {
    aspectRatio: 4 / 3,
  },
  canvas: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 15,
  },
  button: {
    marginTop: 15,
    width: '100%',
    alignItems: 'center',
  },
  clearTitle: {
    color: 'red',
    textAlign: 'center',
  },
  clearButton: {
    width: 200,
    // marginTop: 15,
    alignSelf: 'center',
  },
});
