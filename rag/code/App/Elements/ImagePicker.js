import I18n from '@I18n';
import { Platform } from 'react-native';
import _ from 'lodash';
import { openPicker } from '@baronha/react-native-multiple-image-picker';
import { resizeImage } from '../Utils/file';

export async function openMultipleImagePicker(options = {}) {
  const pickerLanguages = {
    doneTitle: I18n.t('IMAGE_PICKER_DONE_TITLE'),
    cancelTitle: I18n.t('IMAGE_PICKER_CANCEL_TITLE'),
    emptyMessage: I18n.t('IMAGE_PICKER_EMPTY_MESSAGE'),
    selectMessage: I18n.t('IMAGE_PICKER_SELECT_MESSAGE'),
    deselectMessage: I18n.t('IMAGE_PICKER_DESELECT_MESSAGE'),
    maximumMessageTitle: I18n.t('IMAGE_PICKER_MAXIMUM_MESSAGE_TITLE'),
    messageTitleButton: I18n.t('IMAGE_PICKER_MESSAGE_TITLE'),
    tapHereToChange: I18n.t('IMAGE_PICKER_TAP_HERE_TO_CHANGE'),
    maximumMessage: I18n.t('IMAGE_PICKER_MAXIMUM_MESSAGE'),
    maximumVideoMessage: I18n.t('IMAGE_PICKER_MAXIMUM_VIDEO_MESSAGE'),
  };

  const result = await openPicker({
    usedCameraButton: false,
    mediaType: 'image',
    maxSelectedAssets: 50,
    isPreview: false,
    ...pickerLanguages,
    ...options,
  });

  const images = Array.isArray(result) ? result : [result];

  const resizedImages = await Promise.all(
    images.map(async (image, index) =>
      resizeImage({
        ...image,
        uri: Platform.OS === 'android' ? image.realPath : image.path,
        index,
      })
    )
  );

  return _.orderBy(resizedImages, ['index'], 'asc');
}
