/**
 * Created by thienmd on 10/7/20
 */
import React from 'react';
import { DeviceEventEmitter, View } from 'react-native';
import I18n from '@I18n';
import { SearchBar } from '@Elements';
import { NavigationEvents } from '@react-navigation/compat';
import InspectionItem from '@Components/InnovatorInspection/InspectionItem';
import BaseLayout from '@Components/Layout/BaseLayout';
import AppList from '../../../../Components/Lists/AppList';
import LoaderContainer from '../../../../Components/Layout/LoaderContainer';
import ListPlaceholder from '../../../../Components/Lists/Placeholders/ListPlaceholder';
import SyncButton from '../../../../Components/InnovatorInspection/Sync/SyncButton';
import useSync from '../../../../Context/Sync/Hooks/UseSync';
import useInspection from '../../../../Context/Inspection/Hooks/UseInspection';
import useUser from '../../../../Context/User/Hooks/UseUser';
import useHome from '../../../../Context/Home/Hooks/UseHome';

const InspectionScreen = ({ navigation }) => {
  const {
    inspection: { inspections },
    getInspections,
    getInspectionFormDetail,
    getDefaultStatus,
  } = useInspection();
  const {
    user: { user },
  } = useUser();
  const {
    home: { isOfflineInspection },
  } = useHome();
  const { isSyncingDB, isSyncingSignature, isSyncingImage, doSynchronize } = useSync();
  const [keyword, setKeyword] = React.useState('');

  const onItemPress = async (item) => {
    const formData = await getInspectionFormDetail(item, user);
    if (formData) {
      navigation.navigate('inspectionDetail', { formData, workflow: item });
    }
  };

  const mainLayoutProps = {
    showLogo: true,
    onBtAddPress: () => {
      navigation.navigate('selectProperty');
    },
    showAddButton: true,
    showBackButton: !isOfflineInspection,
  };

  const listProps = {
    data: inspections.data,
    numColumns: 1,
    keyword,
    showsVerticalScrollIndicator: false,
    ItemSeparatorComponent: () => <View />,
    isRefresh: inspections.isRefresh,
    isLoadMore: inspections.isLoadMore,
    currentPage: inspections.currentPage,
    totalPage: inspections.totalPage,
    loadData: getInspections,

    renderItem: ({ item }) => <InspectionItem onItemPress={() => onItemPress(item)} {...item} hideSync />,
    keyExtractor: (item) => `${item.id}`,
  };

  const onSearch = (text) => {
    setKeyword(text);
    getInspections({ page: 1, keyword: text });
    // searchRef.current.setText(selectedTab === 0 ? )
  };

  const initData = async () => {
    getDefaultStatus();
    getInspections({ page: 1, keyword: '' });
  };

  React.useEffect(() => {
    initData();
    const subscription = DeviceEventEmitter.addListener('save_inspection_success', () => {
      getInspections({ page: 1, keyword });
    });
    return () => {
      subscription.remove();
    };
  }, []);

  const onSyncPress = () => {
    doSynchronize();
  };
  // cons
  return (
    <BaseLayout {...mainLayoutProps}>
      <View>
        <SearchBar placeholder={I18n.t('SEARCH_JOB')} onSearch={onSearch} />
        <SyncButton loading={isSyncingDB || isSyncingSignature || isSyncingImage} onPress={onSyncPress} />
      </View>
      <LoaderContainer isLoading={inspections.isRefresh} loadingComponent={<ListPlaceholder />}>
        <AppList {...listProps} />
      </LoaderContainer>
      <NavigationEvents onWillFocus={() => onSyncPress()} />
    </BaseLayout>
  );
};
export default InspectionScreen;
