import RNFS from 'react-native-fs';
import PhotoEditor from 'react-native-photo-editor';
import _ from 'lodash';
import I18n from '@I18n';
import { ensureFolder, removeFile } from '../../../Utils/file';
import { generateGUID } from '../../../Utils/number';
import useApp from '../../../Context/App/Hooks/UseApp';
import { toast } from '../../../Utils';

export const usePhotoEditor = () => {
  const { showLoading } = useApp();

  const withLoading = async (fn) => {
    try {
      showLoading(true);
      await fn();
    } catch (e) {
      toast.showError(e.message);
      showLoading(false);
    }
  };

  const showPhotoEditor = async (image, onSuccess, onCancel) => {
    const photoPath = `${RNFS.DocumentDirectoryPath}/tempImage.jpg`;

    await withLoading(async () => {
      await removeFile(photoPath);
      await RNFS.copyFile(image.uri, photoPath);
    });

    const onDone = async () => {
      const imageFolder = `${RNFS.DocumentDirectoryPath}/images`;
      const destPath = `${imageFolder}/${generateGUID()}.jpg`;
      await ensureFolder(imageFolder);
      await RNFS.moveFile(photoPath, destPath);
      await RNFS.unlink(image.uri);
      onSuccess({
        id: image.id,
        uri: `file://${destPath}`,
        files: {
          position: image.files?.position,
        },
      });
    };

    const languageKeys = {
      doneTitle: 'COMMON_DONE',
      saveTitle: 'COMMON_SAVE',
      eraserTitle: 'PHOTO_EDITOR_ERASER',
    };
    const languages = _.keys(languageKeys).reduce((acc, key) => {
      acc[key] = I18n.t(languageKeys[key]);
      return acc;
    }, {});

    PhotoEditor.Edit({
      path: photoPath,
      hiddenControls: ['crop', 'sticker', 'save', 'share'],
      languages,
      colors: [
        '#000000',
        '#808080',
        '#B22222',
        '#FFA500',
        '#FFFF00',
        '#008000',
        '#00FFFF',
        '#0000FF',
        '#EE82EE',
        '#A52A2A',
        '#D2691E',
        '#FF4500',
        '#2E8B57',
        '#ADFF2F',
        '#FF69B4',
        '#4B0082',
        '#800000',
        '#FFD700',
        '#008080',
        '#FFFFFF',
      ],
      onDone,
      onCancel,
    });
  };

  return { showPhotoEditor };
};
