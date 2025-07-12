import React from 'react';
import I18n from '@I18n';
import BaseLayout from '@Components/Layout/BaseLayout';
import { NavigationEvents } from '@react-navigation/compat';

import styles from './styles';
import LoaderContainer from '../../../Components/Layout/LoaderContainer';
import ListPlaceholder from '../../../Components/Lists/Placeholders/ListPlaceholder';
import useSync from '../../../Context/Sync/Hooks/UseSync';
import { SyncState } from '../../../Config/Constants';
import SyncList from '../../../Components/InnovatorInspection/Sync/SyncList';
import useInspection from '../../../Context/Inspection/Hooks/UseInspection';
import useUser from '../../../Context/User/Hooks/UseUser';
import TabBar from '../../../Components/InnovatorInspection/TabBar';
import useHome from '../../../Context/Home/Hooks/UseHome';
import { getNonOfflineInspectionProps } from '../Inspection/InspectionHome';
import SyncItem, { SyncImageItem, SyncSignatureItem } from '../../../Components/InnovatorInspection/Sync/SyncItem';

const SyncScreen = ({ navigation }) => {
  const {
    sync: {
      unSyncDataInspections,
      syncingImageWorkflowIds,
      unSyncImageInspections,
      syncingSignatureWorkflowIds,
      unSyncSignatureInspections,
    },
    isSyncingDB,
    doSynchronize,
    getListUnSync,
  } = useSync();

  const {
    home: { isOfflineInspection },
  } = useHome();
  const { getInspectionFormDetail } = useInspection();
  const {
    user: { user },
  } = useUser();

  const [selectedTab, setSelectedTab] = React.useState(0);

  // get list sync when screen focus and empty data
  getSyncList = () => {
    if (
      [unSyncSignatureInspections, unSyncDataInspections, unSyncImageInspections].every((arr) => arr.data.length === 0)
    ) {
      getListUnSync();
    }
  };

  const onItemPress = async (item) => {
    const formData = await getInspectionFormDetail(item, user);
    if (formData) {
      navigation.navigate('inspectionDetail', { formData, workflow: item });
    }
  };

  const onItemPhotoPress = async (item) => {
    navigation.navigate('detailSyncPhoto', { workflow: item });
  };

  const onItemSignaturePress = async (item) => {
    navigation.navigate('detailSyncSignature', { workflow: item });
  };

  const mainLayoutProps = {
    showLogo: true,
    showBell: true,
    title: 'INSPECTION_TAB_SYNC',
    style: styles.container,
    ...getNonOfflineInspectionProps(isOfflineInspection),
  };

  const inspectionDBLists = {
    list: unSyncDataInspections,
    loadData: getListUnSync,
    renderItem: ({ item }) => (
      <SyncItem
        syncState={isSyncingDB ? SyncState.SYNCING : SyncState.NOT_SYNC}
        {...item}
        onItemPress={() => onItemPress(item)}
      />
    ),
  };

  const inspectionImageLists = {
    list: unSyncImageInspections,
    loadData: getListUnSync,
    renderItem: ({ item }) => {
      const isSyncingImage = syncingImageWorkflowIds.findIndex((workflowId) => workflowId === item.id) > -1;
      return <SyncImageItem onItemPress={() => onItemPhotoPress(item)} isSyncingImage={isSyncingImage} {...item} />;
    },
  };

  const signatureLists = {
    list: unSyncSignatureInspections,
    loadData: getListUnSync,
    renderItem: ({ item }) => {
      const isSyncingSignature = syncingSignatureWorkflowIds.findIndex((workflowId) => workflowId === item.id) > -1;
      return (
        <SyncSignatureItem
          onItemPress={() => onItemSignaturePress(item)}
          isSyncingSignature={isSyncingSignature}
          {...item}
        />
      );
    },
  };

  let contentList = inspectionDBLists;
  if (selectedTab === 1) {
    contentList = inspectionImageLists;
  }

  if (selectedTab === 2) {
    contentList = signatureLists;
  }

  return (
    <BaseLayout {...mainLayoutProps}>
      <TabBar
        values={[I18n.t('INSPECTION_SYNCING_DATA'), I18n.t('INSPECTION_SYNCING_PHOTO'), I18n.t('INSPECTION_SIGN')]}
        selectedIndex={selectedTab}
        onChange={(index) => setSelectedTab(index)}
      />

      {/* <EmptySync title="All data are up to date" /> */}
      <LoaderContainer isLoading={unSyncDataInspections.isRefresh} loadingComponent={<ListPlaceholder />}>
        <SyncList {...contentList} />
      </LoaderContainer>
      <NavigationEvents
        onWillFocus={() => {
          doSynchronize();
          getSyncList();
        }}
      />
    </BaseLayout>
  );
};

export default SyncScreen;
