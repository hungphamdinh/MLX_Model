import React from 'react';
import BaseLayout from '@Components/Layout/BaseLayout';
import { RefreshControl } from 'react-native';

import styles from '../styles';
import ListPlaceholder from '../../../../Components/Lists/Placeholders/ListPlaceholder';
import useSync from '../../../../Context/Sync/Hooks/UseSync';
import ItemPhotoSync from '../../../../Components/InnovatorInspection/Sync/ItemPhotoSync';
import AwareScrollView from '../../../../Components/Layout/AwareScrollView';
import EmptyListComponent from '../../../../Components/Lists/EmptyListComponent';

const DetailSyncSignatureScreen = ({ navigation }) => {
  const workflow = navigation.getParam('workflow');
  const {
    sync: { unSyncSignatures, isLoading, syncingSignatures },
    getUnSyncSignatures,
    resetSyncPhotosAndSignatures,
  } = useSync();

  const loadData = () => {
    getUnSyncSignatures({ workflowGuid: workflow.guid });
  };

  React.useEffect(() => {
    loadData();
    return () => {
      resetSyncPhotosAndSignatures();
    };
  }, []);

  const mainLayoutProps = {
    showBell: true,
    title: workflow.subject,
    style: styles.container,
  };

  return (
    <BaseLayout {...mainLayoutProps}>
      <AwareScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadData} />}>
        {unSyncSignatures ? (
          <>
            {unSyncSignatures.length === 0 ? (
              <EmptyListComponent />
            ) : (
              <>
                {unSyncSignatures.map((item) => {
                  item.path = `file://${item.path}`;
                  return (
                    <ItemPhotoSync
                      key={`${item.guid}`}
                      item={item}
                      title={item.title}
                      syncingMedias={syncingSignatures}
                    />
                  );
                })}
              </>
            )}
          </>
        ) : (
          <ListPlaceholder />
        )}
      </AwareScrollView>
    </BaseLayout>
  );
};

export default DetailSyncSignatureScreen;
