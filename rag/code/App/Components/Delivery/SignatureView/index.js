/**
 * Created by thienmd on 10/5/20
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@Elements';
import RNFS from 'react-native-fs';
import I18n from '@I18n';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RNSketchCanvas from '@gigasz/react-native-sketch-canvas';
import { Colors } from '../../../Themes';
import { generateGUID } from '../../../Utils/number';
import { ensureFolder } from '../../../Utils/file';

const SignatureView = ({ name, setSaveFnc, onSignatureSaved, onClear, ...restProps }) => {
  const signatureRef = React.createRef();

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
      const surveyParams = {
        file: destPath,
        fileName: destPath.substring(destPath.lastIndexOf('/') + 1),
        description: name,
        mimeType: 'image/jpeg',
        path: destPath,
      };
      onSignatureSaved(surveyParams);
    } catch (e) {
      console.log('on saved error', e);
    }
  };

  return (
    <View style={styles.container}>
      <RNSketchCanvas
        {...restProps}
        testID="signature-canvas"
        ref={signatureRef}
        style={styles.signature}
        containerStyle={styles.signature}
        canvasStyle={styles.canvas}
        defaultStrokeIndex={0}
        onClearPressed={onClear}
        defaultStrokeWidth={3}
        clearComponent={
          <View style={styles.deleteWrapper}>
            <Ionicons name="trash-outline" size={15} color="black" />
            <Text style={styles.textDelete} text={I18n.t('AD_COMMON_DELETE')} />
          </View>
        }
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
    </View>
  );
};

export default SignatureView;

const styles = StyleSheet.create({
  container: {
    // marginBottom: 20,
  },
  textDelete: {
    paddingLeft: 5,
    fontWeight: 'bold',
  },
  deleteWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  signature: {
    width: '100%',
    height: 250,
    borderRadius: 20,
    backgroundColor: Colors.bgWhite,
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
});
