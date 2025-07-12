import React from 'react';
import BaseLayout from '@Components/Layout/BaseLayout';

import styles from '../styles';
import useSync from '../../../../Context/Sync/Hooks/UseSync';
import AppList from '../../../../Components/Lists/AppList';
import ItemPhotoSync from '../../../../Components/InnovatorInspection/Sync/ItemPhotoSync';
import { SyncState } from '../../../../Config/Constants';

const DetailSyncPhotoScreen = ({ navigation }) => {
  const workflow = navigation.getParam('workflow');
  const {
    sync: { unSyncPhotos, syncingImages },
    getUnSyncPhotos,
    resetSyncPhotosAndSignatures,
  } = useSync();

  const loadData = (page) => {
    getUnSyncPhotos({
      page,
      workflowGuid: workflow.guid,
    });
  };

  React.useEffect(() => {
    loadData(1);
    return () => {
      resetSyncPhotosAndSignatures();
    };
  }, []);

  const mainLayoutProps = {
    showBell: true,
    title: workflow.subject,
    style: styles.container,
  };

  const listProps = {
    data: unSyncPhotos.data,
    numColumns: 1,
    showsVerticalScrollIndicator: false,
    isRefresh: unSyncPhotos.isRefresh,
    isLoadMore: unSyncPhotos.isLoadMore,
    currentPage: unSyncPhotos.currentPage,
    totalPage: unSyncPhotos.totalPage,
    loadData: ({ page }) => loadData(page),

    renderItem: ({ item }) => {
      const { path } = item;
      const fileName = path.substring(path.lastIndexOf('/') + 1);
      return item.path ? <ItemPhotoSync item={item} title={fileName} syncingMedias={syncingImages} /> : null;
    },
    keyExtractor: (item) => `${item.guid}`,
  };

  return (
    <BaseLayout {...mainLayoutProps}>
      <AppList {...listProps} />
    </BaseLayout>
  );
};

export default DetailSyncPhotoScreen;
