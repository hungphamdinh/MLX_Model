import I18n from '@I18n';
import { AlertNative } from '@Components';
import { ControlOfficePrjId } from '../Config/Constants';
import { Colors, Metric } from '../Themes';
import { isSGBundleID, isUatBundleId, isMYBundleID } from '../Config';

export function _replaceSpace(str) {
  if (str) {
    return str.replace(/\u0020/, '\u00a0');
  }
  return str;
}

function extractErrorMessage(errorString) {
  const regex = /"(.*?)"/;
  const matches = errorString.match(regex);

  if (matches && matches.length >= 2) {
    return matches[1]; // Extracted error message between the double quotes
  }
  return I18n.t('SOMETHING_WENT_WRONG');
}

function extractErrorCode(errorString) {
  const regex = /Code=(-?\d+)/;
  const matches = errorString.match(regex);

  if (matches && matches.length >= 2) {
    return parseInt(matches[1], 10); // Extracted error code as an integer
  }
  return null;
}

export const handleBiometricError = (isFaceID, errMessage) => {
  const errorCode = extractErrorCode(errMessage);
  const extractedErrorMessage = extractErrorMessage(errMessage);
  const isLocked = errorCode === -1;
  if (isLocked) {
    const sensorMessage = I18n.t(isFaceID ? 'AUTH_FACE_ID' : 'AUTH_FINGERPRINT');
    const errorContent = I18n.t('AUTH_BIOMETRIC_FAILED_CONTENT', null, sensorMessage);
    const errorTitle = I18n.t('AUTH_BIOMETRIC_FAILED_TITLE', null, sensorMessage);
    AlertNative(errorTitle, errorContent, undefined, undefined, I18n.t('COMMON_CLOSE'));
    return;
  }
  AlertNative(I18n.t('MODAL_ERROR_TITLE'), extractedErrorMessage, undefined, undefined, I18n.t('COMMON_CLOSE'));
};

export function parseToJson(response) {
  try {
    return JSON.parse(response);
  } catch (error) {
    return response;
  }
}

export const transformWithCOTags = (data, regainUserId = true) =>
  data.map((item) => {
    if (regainUserId) {
      item.id = item.userId;
    }
    item.tagName = item.tenantId === ControlOfficePrjId ? 'CO' : '';
    return item;
  });

export const transformWithRoleTags = (data) =>
  data.map((item) => {
    const showNonSavillsTag = [isSGBundleID, isUatBundleId, isMYBundleID].some(Boolean);

    item.tagName = item.isProvider ? (showNonSavillsTag ? 'NON_SAVILLS_USER' : 'CONTRACTOR') : 'SAVILLS_USER';
    item.tagColor = item.isProvider ? Colors.skyblue : Colors.primary;
    item.textAdditionStyle = { maxWidth: Metric.ScreenWidth - (item.isProvider ? 180 : 150) };
    return item;
  });
