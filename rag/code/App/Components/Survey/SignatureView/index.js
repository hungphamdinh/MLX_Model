/**
 * Created by thienmd on 10/5/20
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from '@Elements';
import RNFS from 'react-native-fs';
import _ from 'lodash';
import I18n from '@I18n';
import RNSketchCanvas from '@gigasz/react-native-sketch-canvas';
import { Colors } from '@Themes';
import { generateGUID } from '@Utils/number';
import { ensureFolder } from '@Utils/file';

const SignatureView = ({ name, setSaveFnc, onSignatureSaved, ...restProps }) => {
  const signatureRef = React.createRef();
  const onClearPressed = () => {
    signatureRef.current.clear();
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
      const params = { path: destPath, name };
      const surveyParams = {
        file: destPath,
        fileName: destPath.substring(destPath.lastIndexOf('/') + 1),
        description: name,
        mimeType: 'image/jpeg',
        path: destPath,
      };
      onSignatureSaved(restProps.isUploadDirect ? surveyParams : params);
    } catch (e) {
      console.log('on saved error', e);
    }
  };

  return (
    <View style={styles.container}>
      <RNSketchCanvas
        {...restProps}
        ref={signatureRef}
        style={styles.signature}
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
      {_.size(name) > 0 && <Text style={styles.title}>{name}</Text>}

      <Button
        danger
        containerStyle={styles.clearButton}
        title={I18n.t('AD_CLEAR_SIGNATURE')}
        onPress={onClearPressed}
      />
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
    backgroundColor: Colors.semiGray,
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
