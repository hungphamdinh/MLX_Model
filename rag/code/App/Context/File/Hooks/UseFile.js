import { Platform } from 'react-native';
import I18n from '@I18n';
import RNFetchBlob from 'react-native-blob-util';
import RNFS from 'react-native-fs';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import FileViewer from 'react-native-file-viewer';
import { useHandlerAction, useStateValue } from '../../index';
import { RequestApi } from '../../../Services';
import { modal } from '../../../Utils';
import {
  downloadAndViewDocumentFailure,
  downloadAndViewDocumentRequest,
  downloadAndViewDocumentSuccess,
  downloadImageFailure,
  downloadImageRequest,
  downloadImageSuccess,
  getFileReferenceFailure,
  getFileReferenceRequest,
  getFileReferenceSuccess,
  getByReferenceIdAndModuleNamesFailure,
  getByReferenceIdAndModuleNamesRequest,
  getByReferenceIdAndModuleNamesSuccess,
  getFileByReferenceIdFailure,
  getFileByReferenceIdRequest,
  getFileByReferenceIdSuccess,
  uploadFilesFailure,
  uploadFilesRequest,
  uploadFilesSuccess,
  getFileByGuidRequest,
  getFileByGuidSuccess,
  getFileByGuidFailure,
  resetFilesRequest,
  DELETE_FILE,
} from '../Actions';
import { ensureFolder } from '../../../Utils/file';
import { downLoadFile, getBearerToken } from '../../../Services/FileService';
import { generateGUID } from '../../../Utils/number';
import useApp from '../../App/Hooks/UseApp';

const useFile = () => {
  const [{ file }, dispatch] = useStateValue();
  const { showLoading } = useApp();
  const { withLoadingAndToastHandling } = useHandlerAction();

  const downloadAndViewDocument = async (payload) => {
    try {
      dispatch(downloadAndViewDocumentRequest(payload));

      const { url, fileName } = payload;
      const prefixFolder = Platform.OS === 'ios' ? '' : 'file://';
      const parentFolder = `${prefixFolder}${RNFS.DocumentDirectoryPath}/documents`;
      const localFile = `${parentFolder}/${fileName}`;

      await ensureFolder(parentFolder);
      const result = await downLoadFile(url, localFile, undefined, 'GET');

      dispatch(downloadAndViewDocumentSuccess(result));
      await FileViewer.open(localFile);
    } catch (err) {
      dispatch(downloadAndViewDocumentFailure(err));
    }
  };

  const uploadFiles = async (referenceId, files) => {
    try {
      dispatch(uploadFilesRequest({ referenceId, files }));
      const response = await RequestApi.uploadFiles(referenceId, files);
      dispatch(uploadFilesSuccess(response));
      return response;
    } catch (err) {
      dispatch(uploadFilesFailure(err));
    }
    return null;
  };

  const deleteFile = async (fileId) => {
    const response = await RequestApi.requestDeleteFile(fileId);
    return response;
  };

  const downloadImage = async (url) => {
    try {
      showLoading(true);
      dispatch(downloadImageRequest(url));
      const dirs = RNFetchBlob.fs.dirs;

      const fetchRes = await RNFetchBlob.config({
        fileCache: true,
        appendExt: 'png',
        path: `${dirs.DocumentDir}/images/${generateGUID()}.png`,
      }).fetch('GET', url, getBearerToken());

      CameraRoll.save(fetchRes.path());
      dispatch(downloadImageSuccess(fetchRes.path()));
      return fetchRes.path();
    } catch (err) {
      dispatch(downloadImageFailure(err));
      modal.showError(I18n.t('ERROR_SOMETHING_WENT_WRONG'));
      throw new Error(I18n.t('ERROR_SOMETHING_WENT_WRONG'));
    } finally {
      showLoading(false);
    }
  };

  const getFileReference = async (referenceId, isGUID) => {
    try {
      dispatch(
        getFileReferenceRequest({
          referenceId,
          isGUID,
        })
      );
      const response = await RequestApi.getFileReference(referenceId);
      if (isGUID) {
        dispatch(getFileByGuidSuccess(response));
      } else {
        dispatch(getFileReferenceSuccess(response));
      }
      return response;
    } catch (err) {
      dispatch(getFileReferenceFailure(err));
      return [];
    }
  };

  const getFileByGuid = async (guid) => {
    try {
      dispatch(getFileByGuidRequest(guid));
      const response = await RequestApi.getFileByGuid(guid);
      if (response.length > 0) {
        dispatch(getFileByGuidSuccess(response));
      }
      return response;
    } catch (err) {
      dispatch(getFileByGuidFailure(err));
      return [];
    }
  };
  const getFileByReferenceId = async (documentId) => {
    try {
      dispatch(getFileByReferenceIdRequest(documentId));
      const response = await RequestApi.getFileReference(documentId);
      dispatch(getFileByReferenceIdSuccess(response));
    } catch (err) {
      dispatch(getFileByReferenceIdFailure(err));
    }
  };

  const getByReferenceIdAndModuleNames = async (referenceId, moduleName, fieldName) => {
    try {
      dispatch(getByReferenceIdAndModuleNamesRequest({ referenceId, moduleName, fieldName }));
      const response = await RequestApi.getByReferenceIdAndModuleNames(referenceId, moduleName);
      dispatch(getByReferenceIdAndModuleNamesSuccess({ fieldName, result: response }));
    } catch (err) {
      dispatch(getByReferenceIdAndModuleNamesFailure(err));
    }
  };

  const resetFiles = async () => {
    dispatch(resetFilesRequest());
  };

  return {
    file,
    downloadAndViewDocument,
    uploadFiles,
    deleteFile: withLoadingAndToastHandling(DELETE_FILE, deleteFile),
    downloadImage,
    getFileReference,
    getFileByGuid,
    getFileByReferenceId,
    getByReferenceIdAndModuleNames,
    resetFiles,
  };
};

export default useFile;
