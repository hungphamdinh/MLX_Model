/**
 * Created by thienmd on 10/7/20
 */
import React, { useState, useEffect } from 'react';
import I18n from '@I18n';
import BaseLayout from '@Components/Layout/BaseLayout';
import { DeviceEventEmitter, LayoutAnimation, View } from 'react-native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import AppList from '../../../../Components/Lists/AppList';
import useInspection from '../../../../Context/Inspection/Hooks/UseInspection';
import styles from './styles';
import Filter from '../../../../Components/Filter';
import InspectionHomeItem from '../../../../Components/InnovatorInspection/InspectionHomeItem';
import useOnlineInspectionList from './Hooks/useOnlineInspectionList';
import useOfflineInspectionList from './Hooks/useOfflineInspectionList';
import useTeam from '../../../../Context/Team/Hooks/UseTeam';
import useUser from '../../../../Context/User/Hooks/UseUser';
import useSync from '../../../../Context/Sync/Hooks/UseSync';
import { Colors } from '../../../../Themes';
import { INSPECTION_FORM_TYPE } from '../../../../Config/Constants';
import useFeatureFlag from '../../../../Context/useFeatureFlag';
import _ from 'lodash';

const ViewModeWrapper = styled.View`
  align-items: flex-end;
`;

const ViewModeButton = styled.TouchableOpacity`
  padding: 10px;
`;

const RemainingItem = styled.View`
  width: 50%;
  height: 0px;
`;

const InspectionListScreen = ({ navigation }) => {
  const statusId = navigation.getParam('statusId');
  const propertyId = navigation.getParam('propertyId');
  const isOnline = navigation.getParam('isOnline');
  const [isGrid, setIsGrid] = useState(true);
  const keyPrefix = isGrid ? '#' : '_';

  const { isEnableLiveThere } = useFeatureFlag();

  const listSorts = [
    {
      id: 1,
      type: 'remoteId',
      isAsc: true,
      name: 'INSPECTION_V3_ID',
    },
    {
      id: 2,
      type: 'remoteId',
      name: 'INSPECTION_V3_ID',
    },
    {
      id: 3,
      type: 'subject',
      isAsc: true,
      name: 'INSPECTION_JOB_NAME',
    },
    {
      id: 4,
      type: 'subject',
      name: 'INSPECTION_JOB_NAME',
    },
    {
      id: 5,
      type: 'startDate',
      name: 'COMMON_START_DATE',
      isAsc: true,
    },
    {
      id: 6,
      type: 'startDate',
      name: 'COMMON_START_DATE',
    },
    {
      id: 7,
      type: 'team',
      name: 'COMMON_TEAM',
      isAsc: true,
    },
    {
      id: 8,
      type: 'team',
      name: 'COMMON_TEAM',
    },
    {
      id: 9,
      type: 'inspectionPropertyName',
      name: 'INSPECTION_PROPERTY_NAME',
      isAsc: true,
    },
    {
      id: 10,
      type: 'inspectionPropertyName',
      name: I18n.t(isEnableLiveThere ? 'PROPERTY_REFERENCE_NUMBER' : 'INSPECTION_PROPERTY_NAME'),
    },
  ];

  const reportTypes = [
    {
      id: INSPECTION_FORM_TYPE.INSPECTION,
      name: 'INSPECTION_REPORT_TYPE_INSPECTION',
    },
    {
      id: INSPECTION_FORM_TYPE.INVENTORY_CHECK_LIST,
      name: 'INSPECTION_REPORT_TYPE_INVENTORY',
    },
  ];
  const {
    inspection: { listStatus },
    getInspectionFormDetail,
    getInspectionFormDetailOnline,
    viewReport,
    isLoading,
  } = useInspection();

  const { doSynchronize } = useSync();
  const {
    user: { user },
  } = useUser();

  const {
    team: { inspectionTeams },
  } = useTeam();

  const filterData = {
    statusIds: {
      title: 'COMMON_STATUS',
      multiple: true,
      options: listStatus,
    },
    typeIds: {
      title: 'INSPECTION_REPORT_TYPE',
      multiple: true,
      options: reportTypes,
      onTrigger: (item, isExist, modalFiltered) => {
        if (!isExist) {
          const closedStatus = listStatus.find((status) => status.isIssueClosed);
          modalFiltered.statusIds = [closedStatus?.id];
        }
      },
    },
  };

  const sortData = {
    sortIds: {
      title: 'COMMON_SORT_BY',
      options: listSorts,
    },
  };

  const [keyword, setKeyword] = React.useState('');
  const [selectedFilter, setSelectedFilter] = useState({ statusIds: statusId ? [`${statusId}`] : [], typeIds: [] });
  const [selectedSort, setSelectedSort] = useState({
    sortIds: [],
  });
  const inspectionHook = isOnline ? useOnlineInspectionList : useOfflineInspectionList;
  const { loadData, list, pickUp, release, onRemovePress, resetInspectionLocations } = inspectionHook(
    keyword,
    selectedFilter,
    selectedSort,
    propertyId
  );

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('ReloadInspectionList', () => loadData(1));
    return () => {
      subscription.remove('ReloadInspectionList', loadData);
    };
  }, []);

  const onApplyFilter = (value) => {
    setSelectedFilter(value);
  };

  const onApplySort = (value) => {
    setSelectedSort(value);
  };

  const onViewReport = async (item) => {
    viewReport({
      workflowData: item,
      isOnlineForm: item.isOnline,
    });
  };

  const onPickUpPress = async (item) => {
    pickUp(item);
  };

  const onReleasePress = async (item) => {
    release(item);
  };

  const onItemPress = async (item) => {
    resetInspectionLocations();
    if (item.isOnline) {
      getInspectionFormDetailOnline(item);
    } else {
      const formData = await getInspectionFormDetail(item, user);
      if (formData) {
        navigation.navigate('inspectionDetail', {
          id: item.id,
          formData,
          workflow: item,
          isDetail: true,
        });
      }
    }
  };

  const changeViewMode = () => {
    setIsGrid(!isGrid);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  const mainLayoutProps = {
    style: styles.container,
    loading: isLoading,
    title: isOnline ? I18n.t('INSPECTION_TAB_JOBS') : I18n.t('INSPECTION_PICKED_JOBS'),
  };

  const listProps = {
    key: keyPrefix,
    data: list.data,
    keyword,
    contentContainerStyle: styles.list,
    showsVerticalScrollIndicator: false,
    isRefresh: list.isRefresh,
    isLoadMore: list.isLoadMore,
    currentPage: list.currentPage,
    totalPage: !isOnline ? 1 : list.totalPage,
    numColumns: isGrid ? 2 : 1,
    loadData: ({ page }) => loadData(page),

    renderItem: ({ item, index }) => (
      <>
        {item && (
          <>
            <InspectionHomeItem
              vertical
              onItemPress={(val) => onItemPress(val)}
              onViewReport={() => onViewReport(item)}
              allowRelease
              inspectionTeams={inspectionTeams}
              onRemovePress={() => onRemovePress(item, callBack)}
              onPickUpPress={(isRelease) => (isRelease ? onReleasePress(item) : onPickUpPress(item))}
              allowPickUp
              {...item}
              hideSync
              data={item}
            />
            {isGrid && index === _.size(list.data) - 1 && _.size(list.data) % 2 !== 0 && <RemainingItem />}
          </>
        )}
      </>
    ),
    keyExtractor: (item) => `${keyPrefix}${item.id}`,
  };

  const onSearch = (text) => {
    setKeyword(text);
  };

  React.useEffect(() => {
    loadData(1);
  }, [keyword, selectedFilter, selectedSort]);

  return (
    <BaseLayout {...mainLayoutProps}>
      <Filter
        searchPlaceHolder="SEARCH_JOB"
        data={filterData}
        onSearch={onSearch}
        onCompleted={onApplyFilter}
        selectedFilter={selectedFilter}
        selectedSort={selectedSort}
        sortData={sortData}
        onSortCompleted={onApplySort}
      />
      <ViewModeWrapper>
        <ViewModeButton onPress={changeViewMode}>
          <Icon size={25} color={Colors.azure} name={isGrid ? 'ios-grid' : 'ios-list'} />
        </ViewModeButton>
      </ViewModeWrapper>
      <AppList {...listProps} />
    </BaseLayout>
  );
};
export default InspectionListScreen;
