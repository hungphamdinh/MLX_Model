/* eslint-disable no-unused-expressions */
/* eslint-disable no-shadow */
/* @flow */

import React, { useEffect, useState } from 'react';
import { NavigationEvents } from '@react-navigation/compat';
import I18n from '@I18n';
import LoaderContainer from '@Components/Layout/LoaderContainer';
import ListPlaceholder from '@Components/Lists/Placeholders/ListPlaceholder';
import { DeviceEventEmitter, View } from 'react-native';
import ItemPM from '../../../Components/ItemApp/ItemPM';
import { Colors } from '../../../Themes';

import AppList from '../../../Components/Lists/AppList';

import usePlanMaintenance from '../../../Context/PlanMaintenance/Hooks/UsePlanMaintenance';
import { Modules, INSPECTION_LINKAGE_JOB_TYPE } from '../../../Config/Constants';
import ModalChooseInspection from '../../../Modal/ModalChooseInspection';
import useInspection from '../../../Context/Inspection/Hooks/UseInspection';
import useSync from '../../../Context/Sync/Hooks/UseSync';
import SyncMgr from '../../../Services/OfflineDB/Mgr/SyncMgr';
import { modal } from '../../../Utils';
import useUser from '../../../Context/User/Hooks/UseUser';
import { Hud } from '../../../Elements';

const ListPM = ({ navigation, data, getData, isHistory }) => {
  const {
    user: { user },
  } = useUser();

  const [isShowModal, setIsShowModal] = useState(false);
  const [isViewReport, setIsViewReport] = useState(false);
  const [itemPM, setItemPM] = useState(null);
  const [inspectionJob, setInspectionJob] = useState(null);
  const [inspections, setInspections] = useState([]);
  const [isUnSync, setIsUnSync] = useState(false);

  const { updateItemPM } = usePlanMaintenance();
  const { viewReport, executeInspection, getInspectionDetail, isLoading, getInspectionLinkageDetail } = useInspection();

  const {
    sync: { inSyncProgress },
    syncDataToExecute,
    doSynchronize,
    getListUnSync,
  } = useSync();
  const [jobType, setJobType] = useState('');

  useEffect(() => {
    initSyncData();
  }, []);
  useEffect(() => {
    if (!inSyncProgress) {
      if (jobType === INSPECTION_LINKAGE_JOB_TYPE.PICKED_UP) {
        onExecute(inspectionJob);
      }
      if (jobType === INSPECTION_LINKAGE_JOB_TYPE.RELEASED) {
        getInspectionLinkageDetail(inspectionJob);
      }
      setJobType('');
    }
  }, [jobType, inSyncProgress]);

  const initSyncData = async () => {
    syncData();
    const { unSyncDataInspections } = await getListUnSync();
    if (unSyncDataInspections.items.length > 0) {
      setIsUnSync(true);
    }
  };

  const syncData = async () => {
    const isSyncCompleted = await SyncMgr.getSyncStatus();
    if (!isSyncCompleted) {
      doSynchronize();
    }
  };

  const goDetailPlan = (item, isSeries = false) => {
    if (!isSeries) {
      addListenerForUpdateItem(item);
    }
    navigation.navigate('detailPlan', {
      id: item.id,
      isSeries,
      onUpdateSuccess: () => DeviceEventEmitter.emit('update_pm'),
    });
  };

  const onCreateInspection = (item) => {
    navigation.navigate('addJobFromPM', {
      linkId: item.id,
      moduleId: Modules.PLANMAINTENANCE,
      assets: item.assets,
      onAddSuccess: () => updateItemPM({ id: item.id, list: data }),
    });
  };

  const onViewInspection = async (workflow) => {
    const isSyncCompleted = await SyncMgr.getSyncStatus();
    if (!isSyncCompleted) {
      modal.showError(I18n.t('INSPECTION_MUST_SYNC_MESSAGE'));
    } else if (workflow.length > 1) {
      setIsShowModal(true);
      setInspections(workflow);
      setIsViewReport(true);
    } else if (workflow.length === 1) {
      if (workflow[0]) {
        onViewReport(workflow[0]);
      } else {
        updateItemPM({ id: itemPM?.id, list: data });
      }
    }
  };

  const addListenerForUpdateItem = (item) => {
    DeviceEventEmitter.addListener('update_item_pm', () => updateItemPM({ id: item.id, list: data }));
  };

  const syncJob = (type) => {
    syncDataToExecute();
    setJobType(type);
  };

  const onSetInspectionJob = (item, callBack) => {
    setInspectionJob(item);
    callBack();
  };

  const onStartJob = async (data, item) => {
    addListenerForUpdateItem(item);
    setItemPM(item);
    setInspections(data);
    if (data.length > 1) {
      setIsShowModal(true);
      return;
    }
    if (!data.pickedByUserId) {
      onSyncDataToExecute(data[0]);
      return;
    }
    onExecute(data[0]);
  };

  const onSyncDataToExecute = async (workflow) => {
    setIsShowModal(false);
    setInspectionJob(workflow);
    DeviceEventEmitter.removeAllListeners('update_item_pm', {});
    const isSyncCompleted = await SyncMgr.getSyncStatus();
    if (isSyncCompleted) {
      syncJob(INSPECTION_LINKAGE_JOB_TYPE.PICKED_UP);
      return;
    }
    onExecute(workflow);
  };

  const onExecute = async (workflow) => {
    setIsShowModal(false);
    const isPickedByOther = workflow.pickedByUserId ? user.id !== workflow.pickedByUserId : false;
    if (isPickedByOther) {
      executeInspection(workflow);
      return;
    }
    executeJob(workflow);
  };

  const executeJob = async (workflow) => {
    const response = await executeInspection(workflow, user);
    if (!response?.pickedByUserId) {
      syncJob(INSPECTION_LINKAGE_JOB_TYPE.RELEASED);
    }
  };

  const renderList = (listData) => {
    const listProps = {
      data: listData.data,
      numColumns: 1,
      showsVerticalScrollIndicator: false,
      renderItem: ({ item, index }) => (
        <ItemPM
          onStartInspection={(data) => onStartJob(data, item)}
          onViewInspection={(data) => {
            onViewInspection(data);
            // addListenerForUpdateItem(item);
          }}
          isPM
          isUnSync={isUnSync}
          setIsUnSync={setIsUnSync}
          onCreateInspection={() => onCreateInspection(item)}
          item={item}
          index={index}
          onPress={(data, isSeries) => goDetailPlan(data, isSeries)}
          isHistory={isHistory}
        />
      ),
      isRefresh: listData.isRefresh,
      loadData: ({ page }) => getData(page),
      isLoadMore: listData.isLoadMore,
      currentPage: listData.currentPage,
      totalPage: listData.totalPage,
      keyExtractor: (item) => `${item.id}`,
    };

    return (
      <View style={{ flex: 1 }}>
        <LoaderContainer isLoading={listData.isRefresh} loadingComponent={<ListPlaceholder />}>
          <AppList {...listProps} />
        </LoaderContainer>
      </View>
    );
  };

  const closeModal = () => {
    setIsShowModal(false);
  };

  const onViewReport = (workflow) => {
    viewReport({
      workflowData: workflow.workflow,
      isOnlineForm: true,
    });
    setIsShowModal(false);
  };

  const onSubmit = (workflow) => {
    if (!isViewReport) {
      if (workflow.pickedByUserId) {
        const isPickedByOther = workflow.pickedByUserId ? user.id !== workflow.pickedByUserId : false;
        onSetInspectionJob(workflow, () => (isPickedByOther ? onExecute(workflow) : onSyncDataToExecute(workflow)));
        return;
      }
      onSetInspectionJob(workflow, () => onExecute(workflow));
      return;
    }
    onViewReport(workflow);
  };

  return (
    <>
      <View style={{ flex: 1, backgroundColor: Colors.bgMain }}>
        <>{renderList(data)}</>
      </View>
      {isShowModal && (
        <ModalChooseInspection
          buttonTitle={isViewReport ? 'INSPECTION_VIEW_REPORT' : 'AD_PM_START_INSPECTION'}
          onClosePress={closeModal}
          onSubmit={onSubmit}
          data={inspections}
        />
      )}
      <NavigationEvents
        onWillFocus={() => {
          initSyncData();
        }}
      />
      <Hud loading={isLoading || !!jobType} />
    </>
  );
};

export default ListPM;
