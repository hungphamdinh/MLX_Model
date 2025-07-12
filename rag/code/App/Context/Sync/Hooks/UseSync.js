/* eslint-disable no-async-promise-executor */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-loop-func */
import { useState } from 'react';
import _ from 'lodash';
import RNFS from 'react-native-fs';
import { DeviceEventEmitter, Platform } from 'react-native';
import I18n from '@I18n';
import { zipWithPassword } from 'react-native-zip-archive';
import Share from 'react-native-share';
import BackgroundService from 'react-native-background-actions';
import NetInfo from '@react-native-community/netinfo';

import { useStateValue } from '../../index';
import {
  changeConnectionTypeRequest,
  doSynchronizeDBFailure,
  doSynchronizeDBRequest,
  doSynchronizeDBSuccess,
  doSynchronizeImageFailure,
  doSynchronizeImageRequest,
  doSynchronizeImageSuccess,
  doSynchronizeSignatureFailure,
  doSynchronizeSignatureRequest,
  doSynchronizeSignatureSuccess,
  getListUnSyncFailure,
  getListUnSyncRequest,
  getListUnSyncSuccess,
  setLockSync,
  setInSyncProgress,
  setIsLinkageRequest,
  getLocalDBIdsRequest,
  getLocalDBIdsFailure,
  getLocalDBIdsSuccess,
  getUnSyncPhotosRequest,
  getUnSyncPhotosSuccess,
  getUnSyncPhotosFailure,
  getUnSyncSignaturesRequest,
  getUnSyncSignaturesFailure,
  getUnSyncSignaturesSuccess,
  resetSyncPhotosAndSignaturesRequest,
  patchUnsyncImagesImagesRequest,
  patchUnsyncImagesImagesSuccess,
  patchUnsyncImagesImagesFailure,
  sendLocalDBToServerRequest,
  sendLocalDBToServerSuccess,
  sendLocalDBToServerFailure,
} from '../Actions';
import { makeSyncRequest } from '../../../Services/SynchronizeService';
import FormUserAnswerQuestionImageMgr from '../../../Services/OfflineDB/Mgr/FormUserAnswerQuestionImageMgr';
import { RequestApi } from '../../../Services';
import SyncMgr from '../../../Services/OfflineDB/Mgr/SyncMgr';
import { NetWork, toast } from '../../../Utils';
import SyncDB from '../../../Services/OfflineDB/SyncDB';
import SignatureImageMgr from '../../../Services/OfflineDB/Mgr/SignatureImageMgr';
import { getLiveFiles } from '../../../Services/FileService';
import IDGenerator from '../../../Services/OfflineDB/IDGenerator';
import logService, { getCurrentFilePath } from '../../../Services/LogService';
import SentryService from '../../../Services/SentryService';
import InspectionMgr from '../../../Services/OfflineDB/Mgr/InspectionMgr';
import { ensureFolder, getReactNativeFolderStructure, removeFile } from '../../../Utils/file';
import { ZIP_PASSWORD } from '../../../Config';
import { executeInspectionFailure } from '../../Inspection/Actions';

const log = logService.extend('useSync');
const syncDBTask = {
  taskName: 'Sync Inspection DB',
  taskTitle: 'Sync Data',
  taskDesc: '',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  // color: '#ff00ff',
  linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
  parameters: {
    delay: 1000,
  },
};

const useSync = () => {
  const [{ sync, inspection, app }, dispatch] = useStateValue();
  const [isSyncingDB, setIsSyncingDB] = useState(false);
  const [isSyncingSignature, setIsSyncingSignature] = useState(false);
  const [isSyncingImage, setIsSyncingImage] = useState(false);

  const syncResolve = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));

  const doSynchronize = async () => {
    /**
     *  Only do this thing when we have a internet connection
     *  Must complete sync all images, signatures before sync db
     *  only call sync images when no syncDb is completed
     * */
    const netInfo = await NetInfo.fetch();
    log.info('doSynchronize connectionType: ', netInfo.type);
    const allowCellularSync = _.get(inspection, 'inspectionSetting.isSynchronizationViaCellular');
    await getListUnSync();

    if (!isSyncingDB && !SyncDB.lockSync) {
      if (netInfo.type !== 'wifi' && !allowCellularSync) {
        log.info('connection type is not wifi');
        return;
      }
      SyncDB.lockSync = true;
      dispatch(setLockSync(true));
      // Temporary remove unsynced inspection
      // await removeUnSyncedInspection();
      BackgroundService.start(syncData, syncDBTask);
    }
  };

  const syncData = async (taskDataArguments) => {
    // Example of an infinite loop task
    log.info('syncData');
    const { delay } = taskDataArguments;
    await new Promise(async () => {
      doSynchronizeImage();
      let isLostConnection = false;
      for (let i = 0; BackgroundService.isRunning(); i += 1) {
        const state = await NetInfo.fetch();
        const isConnected = state.isConnected;
        await syncResolve(delay);
        NetWork.setConnected(isConnected);
        if (!isConnected && !isLostConnection) {
          isLostConnection = true;
          log.info('lost connection');
        }
        if (isConnected && isLostConnection) {
          await BackgroundService.stop();
          doSynchronize();
        }
      }
    });
  };

  const doSynchronizeDB = async () => {
    // skip call to backend if is syncing
    if (isSyncingDB) return;
    // return;
    setIsSyncingDB(true);
    try {
      log.info('lost connection');

      const currentSchemaVersion = SyncDB.database.adapter.schema.version;
      const lastPullAt = await SyncDB.database.adapter.getLocal('__watermelon_last_pulled_at');
      let latestSchemaVersion = await SyncDB.database.adapter.getLocal('__watermelon_schema_version');
      latestSchemaVersion = latestSchemaVersion ? Number(latestSchemaVersion) : latestSchemaVersion;
      const isPullWithMigrations =
        currentSchemaVersion > 1 && latestSchemaVersion !== currentSchemaVersion && lastPullAt;
      dispatch(
        doSynchronizeDBRequest({
          isFirstPull: !lastPullAt || isPullWithMigrations,
          isPullWithMigrations,
        })
      );
      if (NetWork.isConnected) {
        const response = await makeSyncRequest();
        await SyncDB.database.adapter.setLocal('__watermelon_schema_version', JSON.stringify(currentSchemaVersion));
        dispatch(doSynchronizeDBSuccess({ response }));
        if (sync.isLinkage) {
          DeviceEventEmitter.emit('update_item_pm');
          DeviceEventEmitter.emit('reloadPMDetail', {});
          dispatch(setIsLinkageRequest(false));
        }
        BackgroundService.stop();
      }
      else {
        resetSyncProcess();
      }
    } catch (err) {
      const errorMessage = I18n.t('INSPECTION_SYNC_DATA_FAILURE');
      log.warn(errorMessage);
      toast.showError(errorMessage);
      dispatch(doSynchronizeDBFailure(err));
      if (!err.message.includes('The Internet connection appears to be offline')) {
        BackgroundService.stop();
      }
      SentryService.captureException(err);
    } finally {
      setIsSyncingDB(false);
      // await delay(5000);
      dispatch(setLockSync(false));
      SyncDB.lockSync = false;
      getListUnSync();
    }
  };

  const resetSyncProcess = () => {
    // reset sync process when the network lost
    SyncDB.lockSync = false;
    setIsSyncingImage(false);
    setIsSyncingDB(false);
    setIsSyncingSignature(false)
  }

  /**
   * Will sync 5 images per time due to the limit of azure firewall, will block if the body of the request is too large
   * */
  const doSynchronizeImage = async () => {
    // skip call to backend if is syncing
    if (isSyncingImage) return;
    setIsSyncingImage(true);
    try {
      const imagesNotSync = await SyncMgr.getImagesNotSync();
      if (imagesNotSync.length === 0) {
        dispatch(doSynchronizeImageSuccess({ syncingImages: [], isComplete: true }));

        // synchronize signatures after success sync images
        doSynchronizeSignature();
        setIsSyncingImage(false);

        return;
      }

      // pick 20 images to sync
      // check if image is exist
      const { existedFiles: syncingImages, notFounds } = await getLiveFiles(imagesNotSync.splice(0, 20));

      // Remove from sync
      if (notFounds.length > 0) {
        await SyncDB.action(async () => {
          await FormUserAnswerQuestionImageMgr.removeSyncImages(notFounds);
        });
      }

      if (_.size(syncingImages) === 0) {
        doSynchronizeImage();
        return;
      }
      // const syncingImages = imagesNotSync.splice(0, 5);
      const syncingImageWorkflowIds = _.uniqBy(syncingImages, 'workflowGuid').map((item) => item.workflowGuid);
      syncingImages.forEach((item) => {
        item.position = item.files.position;
        delete item.files;
      });

      dispatch(doSynchronizeImageRequest({ syncingImageWorkflowIds, syncingImages }));
      if (NetWork.isConnected) {
        const result = await RequestApi.uploadFiles('', syncingImages);
        await SyncDB.action(async () => {
          await FormUserAnswerQuestionImageMgr.updateServerImages(result);
        });
        dispatch(doSynchronizeImageSuccess({ syncingImages }));
        // remove the synced images && update files field
        // console.log('response', response);

        await Promise.all(syncingImages.map(async (file) => RNFS.unlink(file.file)));
        // recursive this function, because we need to sync all images to server
        doSynchronizeImage();
      }
      else {
        resetSyncProcess();
        return;
      }
    } catch (err) {
      const errorMessage = I18n.t('INSPECTION_SYNC_IMAGE_FAILURE');
      log.warn(errorMessage);
      toast.showError(errorMessage);
      dispatch(doSynchronizeImageFailure(err));

      // await delay(5000);
      dispatch(setLockSync(false));
      SyncDB.lockSync = false;
      SentryService.captureException(err);
    } finally {
      setIsSyncingImage(false);
    }
  };

  /**
   * Sync inspection signature (record with empty file property) to server
   * Sync 1 inspection per time
   * */
  const doSynchronizeSignature = async () => {
    // skip call to backend if is syncing

    if (isSyncingSignature) return;
    setIsSyncingSignature(true);
    try {
      // get data
      const { firstWorkFlowSignatures, unSyncWorkflowIds, firstWorkflowGuid } = await SyncMgr.getUnSyncSignatures();
      const { existedFiles: syncingSignatures, notFounds } = await getLiveFiles(firstWorkFlowSignatures);
      // Remove from sync
      if (notFounds.length > 0) {
        await SyncDB.action(async () => {
          await SignatureImageMgr.removeSyncImages(notFounds);
        });
      }

      if (_.size(syncingSignatures) === 0 || _.size(unSyncWorkflowIds) === 0) {
        dispatch(doSynchronizeSignatureSuccess({ syncingSignatures: [], isComplete: true }));
        setIsSyncingSignature(false);
        // must recheck images unsync , if have not then call sync db
        const imagesNotSync = await SyncMgr.getImagesNotSync();
        if (imagesNotSync.length > 0) {
          doSynchronizeImage();
          return;
        }
        // after sync success signature, sync db
        doSynchronizeDB();
        return;
      }

      dispatch(
        doSynchronizeSignatureRequest({
          syncingSignatureWorkflowIds: [firstWorkflowGuid],
          syncingSignatures,
        })
      );

      if (NetWork.isConnected) {
        await Promise.all(
          syncingSignatures.map(async (signature) => {
            const params = {
              guid: signature.guid,
              moduleName: signature.moduleName,
              referenceId: signature.referenceId,
            };
            await RequestApi.uploadFileInspectionSignaturesV2([signature], params);
          })
        );
        dispatch(doSynchronizeSignatureSuccess({ syncingSignatures }));

        await SyncDB.action(async () => {
          await SignatureImageMgr.updateServerImages(syncingSignatures);
        });
        // remove the synced images && update files field

        await Promise.all(syncingSignatures.map(async (file) => RNFS.unlink(file.file)));
        // recursive this function, because we need to sync all images to server
        doSynchronizeSignature();
      }
      else {
        resetSyncProcess();
        return;
      }
    } catch (err) {
      const errorMessage = I18n.t('INSPECTION_SYNC_SIGNATURE_FAILURE');
      log.warn(errorMessage);
      toast.showError(errorMessage);
      dispatch(doSynchronizeSignatureFailure(err));
      // await delay(5000);
      dispatch(setLockSync(false));
      SyncDB.lockSync = false;
      SentryService.captureException(err);
    } finally {
      setIsSyncingSignature(false);
    }
  };

  const getListUnSync = async () => {
    dispatch(getListUnSyncRequest());
    try {
      const response = await SyncMgr.getListUnSync();
      dispatch(getListUnSyncSuccess(response));
      return response;
    } catch (err) {
      dispatch(getListUnSyncFailure(err));
      SentryService.captureException(err);
      toast.showExceptionMessage(err);
    }
    return null;
  };

  const getUnSyncPhotos = async (payload) => {
    dispatch(getUnSyncPhotosRequest(payload));
    try {
      const { page, workflowGuid } = payload;
      const response = await SyncMgr.getUnSyncPhotosByWorkflowId(page, workflowGuid);
      dispatch(getUnSyncPhotosSuccess(response));
      return response;
    } catch (err) {
      dispatch(getUnSyncPhotosFailure(err));
      SentryService.captureException(err);
      toast.showExceptionMessage(err);
    }
    return null;
  };

  const getUnSyncSignatures = async (payload) => {
    dispatch(getUnSyncSignaturesRequest(payload));
    try {
      const { workflowGuid } = payload;
      const response = await SyncMgr.getUnSyncSignaturesByWorkflowId(workflowGuid);
      dispatch(getUnSyncSignaturesSuccess(response));
      return response;
    } catch (err) {
      dispatch(getUnSyncSignaturesFailure(err));
      SentryService.captureException(err);
      toast.showExceptionMessage(err);
    }
    return null;
  };

  const changeConnectionType = (payload) => {
    dispatch(changeConnectionTypeRequest(payload));
  };

  const syncDataToExecute = async () => {
    try {
      dispatch(setInSyncProgress(true));
      await doSynchronize();
    } catch (err) {
      dispatch(executeInspectionFailure(err));
      SentryService.captureException(err);
    }
  };

  const getLocalDBIds = async () => {
    try {
      dispatch(getLocalDBIdsRequest(true));
      const result = await SyncMgr.getLocalDBIds();
      IDGenerator.localIds = result;
      dispatch(getLocalDBIdsSuccess(result));
    } catch (err) {
      dispatch(getLocalDBIdsFailure(err));
      SentryService.captureException(err);
    }
  };

  const resetSyncPhotosAndSignatures = () => {
    dispatch(resetSyncPhotosAndSignaturesRequest());
  };

  const patchUnsyncImagesImages = async () => {
    try {
      dispatch(patchUnsyncImagesImagesRequest(true));
      await SyncDB.action(async () => {
        const result = await FormUserAnswerQuestionImageMgr.patchUnsyncImagesImages();
        dispatch(patchUnsyncImagesImagesSuccess(result));
      });
    } catch (err) {
      dispatch(patchUnsyncImagesImagesFailure(err));
    }
  };

  const sendLocalDBToServer = async (isSendImage) => {
    dispatch(sendLocalDBToServerRequest());
    const documentPath = RNFS.DocumentDirectoryPath;
    const localDbPath = `${documentPath}/localdb`;
    try {
      const imagePath = `${documentPath}/images`;
      const targetZipPath = `${localDbPath}/${isSendImage ? 'images' : 'data'}.zip`;
      const newDBPath = `${localDbPath}/database.sqlite`;
      const newLogPath = `${localDbPath}/log.txt`;
      const folderStructurePath = `${localDbPath}/folder-structure.json`;
      const databasePath =
        Platform.OS === 'android'
          ? `${documentPath.split('/').slice(0, -1).join('/')}/${SyncDB.databaseName}.db`
          : `${documentPath}/${SyncDB.databaseName}.db`;
      await ensureFolder(imagePath);
      await RNFS.mkdir(localDbPath);
      await removeFile(targetZipPath);

      const directoryTreeMap = await getReactNativeFolderStructure(RNFS.DocumentDirectoryPath);
      if (isSendImage) {
        await zipWithPassword(imagePath, targetZipPath, ZIP_PASSWORD);
      } else {
        await RNFS.writeFile(folderStructurePath, JSON.stringify(directoryTreeMap));
        await removeFile(newDBPath);
        const isExistLog = await RNFS.exists(getCurrentFilePath());
        if (isExistLog) {
          await RNFS.copyFile(getCurrentFilePath(), newLogPath);
        }
        await RNFS.copyFile(databasePath, newDBPath);
        await zipWithPassword(localDbPath, targetZipPath, ZIP_PASSWORD);
      }

      dispatch(sendLocalDBToServerSuccess());

      // Share the zip file via email
      const shareOptions = {
        type: 'application/zip',
        url: `file://${targetZipPath}`,
        email: 'pvanthien@savills.com.vn',
        subject: 'Inspection attachment',
        message: 'Inspection zip file.',
      };
      await Share.open(shareOptions);
      await RNFS.unlink(localDbPath);
    } catch (err) {
      dispatch(sendLocalDBToServerFailure(err));
      await RNFS.unlink(localDbPath);
      SentryService.captureException(err);
    }
  };

  const ensureSyncCompleted = async () => {
    const isSyncCompleted = await SyncMgr.getSyncStatus();
    if (!isSyncCompleted) {
      doSynchronize();
    }
    return isSyncCompleted;
  };

  return {
    sync,
    isSyncingDB,
    isSyncingImage,
    isSyncingSignature,
    doSynchronizeSignature,
    doSynchronizeDB,
    doSynchronizeImage,
    doSynchronize,
    getListUnSync,
    changeConnectionType,
    syncDataToExecute,
    getLocalDBIds,
    getUnSyncPhotos,
    getUnSyncSignatures,
    resetSyncPhotosAndSignatures,
    patchUnsyncImagesImages,
    sendLocalDBToServer,
    ensureSyncCompleted,
  };
};

export default useSync;
