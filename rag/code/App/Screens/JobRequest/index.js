import React, { useState } from 'react';
import { DeviceEventEmitter } from 'react-native';
import I18n from '@I18n';
import NavigationService from '@NavigationService';
import _ from 'lodash';
import styled from 'styled-components/native';

import AppList from '../../Components/Lists/AppList';
import BaseLayout from '../../Components/Layout/BaseLayout';
import ItemJR from '../../Components/ItemApp/ItemJR';
import { icons } from '../../Resources/icon';
import useJobRequest from '../../Context/JobRequest/Hooks/UseJobRequest';
import { DashboardStatisticTypes, ModuleNames, Modules } from '../../Config/Constants';
import useTeam from '../../Context/Team/Hooks/UseTeam';
import SegmentControl from '../../Components/segmentControl';
import { Colors } from '../../Themes';
import WhiteSegmentControl from '../../Components/WhiteSegmentControl';
import CreateFloatButton from '../../Components/JobRequests/CreateFloatButton';
import Filter from '../../Components/Filter';
import { convertDate } from '../../Utils';
import { PAGE_SIZE } from '../../Config';
import { isGranted } from '../../Config/PermissionConfig';
import ESignModal from './ESignModal';
import useInventoryRequest from '../../Context/InventoryRequest/Hooks/UserInventoryRequest';
import { sorMode } from '../../../App/Config/Constants';
import useApp from '@Context/App/Hooks/UseApp';
import useAsset from '../../Context/Asset/Hooks/UseAsset';

const SegmentWrapper = styled.View`
  background-color: ${Colors.bgWhite};
  padding: 10px;
`;

const multipleOptionValue = {
  isOverdue: 'isOverdue',
  isExtraService: 'isExtraService',
  isShowDeactive: 'isShowDeactive',
};

const JobRequest = ({ navigation, route }) => {
  const {
    jobRequest: { list, myList, myTeamList, tasks, myTasks, statusList, priorities },
    getAllJR,
    getMyJR,
    getMyTasks,
    getTasks,
    detailTask,
    setVisibleSigningModal,
    setVisiblePreviewModal,
    getJRSetting,
  } = useJobRequest();
  const { getAssetByCode } = useAsset();
  const {
    inventoryRequest: { irSetting },
    getIRSetting,
  } = useInventoryRequest();
  const {
    team: { teams },
    getTeams,
    getUserInTeam,
  } = useTeam();
  const {
    app: { allSettings },
  } = useApp();

  const params = route?.params || {};
  const statusIds = params.statusIds;
  const statisticType = params.statisticType;
  const isSorMode = _.get(allSettings, 'general.inventoryRequestMode') === sorMode.sor;

  const defaultFilter = {
    dateRange: {
      fromDate: undefined,
      toDate: undefined,
    },
    multipleOptions: [],
  };

  const filterData = {
    dateRange: {},
    jobExceedTime: {
      title: I18n.t('JOB_EXCEED_TIME'),
      options: [
        {
          id: 'jobsExceedTargetResponseTime',
          name: I18n.t('JR_TARGET_RESPONSE_TIME_FILTER'),
        },
        {
          id: 'jobsExceedTargetResolutionTime',
          name: I18n.t('JR_TARGET_COMPLETION_TIME_FILTER'),
        },
      ],
    },
    statusIds: {
      title: 'COMMON_STATUS',
      multiple: true,
      options: statusList,
    },
    priorityIds: {
      title: 'COMMON_PRIORITY',
      multiple: true,
      options: priorities,
    },
    teamIds: {
      title: 'COMMON_TEAMS',
      options: teams,
    },
    multipleOptions: {
      multiple: true,
      valKey: 'value',
      options: [
        {
          value: multipleOptionValue.isOverdue,
          name: I18n.t('COMMON_OVERDUE'),
        },
        {
          value: multipleOptionValue.isExtraService,
          name: I18n.t('WO_EXTRA_SERVICE'),
        },
        {
          value: multipleOptionValue.isShowDeactive,
          name: I18n.t('WO_SHOW_DEACTIVE_ONLY'),
        },
      ],
    },
  };

  const [selectedFilter, setSelectedFilter] = useState(defaultFilter);

  const [listJRTabIndex, setListJRTabIndex] = useState(0);
  const [listTaskTabIndex, setListTaskTabIndex] = useState(0);
  const [tabIndex, setTabIndex] = useState(0);

  const [textSearch, setTextSearch] = useState('');

  const [jrItem, setJRItem] = React.useState(null);

  React.useEffect(() => {
    switch (statisticType) {
      case DashboardStatisticTypes.ALL_JR:
        setListJRTabIndex(0);
        break;
      case DashboardStatisticTypes.TEAM_JR:
        setListJRTabIndex(1);
        break;
      case DashboardStatisticTypes.MY_JR:
        setListJRTabIndex(2);
        break;
      default:
        break;
    }

    if (statusIds) {
      setSelectedFilter({
        ...selectedFilter,
        statusIds,
      });
      getList(1);
    }
  }, [statisticType, statusIds]);

  React.useEffect(() => {
    getTeams({
      isMyTeam: false,
      target: ModuleNames.WORK_ORDER,
    });
    getJRSetting();
    getIRSetting();
  }, []);

  React.useEffect(() => {
    getList(1, textSearch, selectedFilter);
  }, [tabIndex, listJRTabIndex, listTaskTabIndex]);

  React.useEffect(() => {
    getList(1);
  }, [textSearch, selectedFilter]);

  React.useEffect(() => {
    const subscriber = DeviceEventEmitter.addListener('UpdateListWorkOrder', getList);
    return () => {
      subscriber.remove();
    };
  }, []);

  const getValueForOptions = (allJobVal, myTeamJobVal, myJobVal, allTaskVal, myTaskVal) => {
    if (tabIndex === 0) {
      if (listJRTabIndex === 0) {
        return allJobVal;
      }
      if (listJRTabIndex === 1) {
        return myTeamJobVal;
      }
      return myJobVal;
    }
    if (listTaskTabIndex === 0) {
      return allTaskVal;
    }
    return myTaskVal;
  };

  const listData = getValueForOptions(list, myTeamList, myList, tasks, myTasks);

  const { data, isRefresh, isLoadMore, currentPage, totalPage } = listData;

  const getList = (page = 1, keyword = textSearch, filter = selectedFilter) => {
    const isOverdue = filter.multipleOptions.includes(multipleOptionValue.isOverdue) || null;
    const isExtraService = filter.multipleOptions.includes(multipleOptionValue.isExtraService) || null;
    const isActive = !filter.multipleOptions.includes(multipleOptionValue.isShowDeactive);
    const { fromDate, toDate } = filter.dateRange;
    const getData = getValueForOptions(getAllJR, getMyJR, getMyJR, getTasks, getMyTasks);
    let filterParams = {};
    if (tabIndex !== 1) {
      filterParams = {
        statusIds: filter.statusIds,
        priorityIds: filter.priorityIds,
        teamIds: filter.teamIds,
        fromDate: fromDate && convertDate.stringToISOString(fromDate),
        toDate: toDate && convertDate.stringToISOString(toDate),
        isOverdue,
        isExtraService,
        isAssignee: listJRTabIndex === 2,
        jobsExceedTargetResponseTime: filter.jobExceedTime
          ? filter.jobExceedTime.includes('jobsExceedTargetResponseTime')
          : false,
        jobsExceedTargetResolutionTime: filter.jobExceedTime
          ? filter.jobExceedTime.includes('jobsExceedTargetResolutionTime')
          : false,
        isActive,
      };
    }

    getData({
      page,
      pageSize: PAGE_SIZE,
      keyword,
      ...filterParams,
    });
  };

  const onApplyFilter = (value) => {
    setSelectedFilter(value);
  };

  const onBtAddPress = async () => {
    NavigationService.navigate('addJobRequest');
  };

  const onBtAddQuickJRPress = () => {
    NavigationService.navigate('addQuickJobRequest');
  };

  const onTextSearchChange = (text) => {
    setTextSearch(text);
    console.log(filterData);
    // getList(1, text);
  };

  const gotoDetail = (item) => {
    if (tabIndex === 0) {
      NavigationService.navigate('editJobRequest', {
        id: item.id,
      });
      // detailJR(item.id);
      // if (item.teamId) {
      //   getUserInTeam(item.teamId);
      // }
      // if (item.categoryId) {
      //   getCategories(item.categoryId);
      // }
      //
      // if (item.categoryId && item.subCategoryId) {
      //   getSubCategories({
      //     areaId: item.categoryId,
      //     categoryId: item.subCategoryId,
      //   });
      // }

      return;
    }

    NavigationService.navigate('editJobRequestTask', {
      id: item.id,
    });
    if (item.team) {
      getUserInTeam(item.team.id);
    }
  };

  const onTabChange = (index) => {
    setTabIndex(index);
  };

  const onListJRTabIndexChange = (index) => {
    setListJRTabIndex(index);
  };

  const onListTaskTabIndexChange = (index) => {
    setListTaskTabIndex(index);
  };

  const renderItem = (item) => (
    <ItemJR
      item={item}
      onPress={() => gotoDetail(item)}
      onPressSign={() => onPressSignOrPreview(item, setVisibleSigningModal)}
      onPressPreview={() => onPressSignOrPreview(item, setVisiblePreviewModal)}
      isShowIRLinkage={irSetting?.isWorkOrderLinked}
      isSorMode={isSorMode}
    />
  );

  const listProps = {
    data,
    isRefresh,
    isLoadMore,
    currentPage,
    totalPage,
    emptyMsg: I18n.t('WO_EMPTY_LIST'),
    iconName: icons.jobRequestEmpty,
    loadData: ({ page }) => getList(page),
    keyExtractor: (item) => item.id.toString(),
    renderItem: ({ item }) => renderItem(item),
  };

  const createButtonProps = {
    buttons: [
      {
        title: 'AD_WO_BUTTON_CREATE',
        onPress: onBtAddPress,
      },
      {
        title: 'AD_WO_BUTTON_QUICK_CREATE',
        onPress: onBtAddQuickJRPress,
      },
    ],
  };

  const onPressSignOrPreview = (item, callBack) => {
    setJRItem(item);
    callBack(true);
  };

  const jrTypesProps = {
    values: ['AD_WO_ALL_WO', 'AD_WO_MY_TEAM', 'AD_WO_MY_WO'],
    selectedIndex: listJRTabIndex,
    onChange: onListJRTabIndexChange,
  };

  const taskTypesProps = {
    values: ['AD_TASK_ALL_TASK', 'AD_TASK_MY_TASK'],
    selectedIndex: listTaskTabIndex,
    onChange: onListTaskTabIndexChange,
  };

  const openQRCodeScanner = () => {
    navigation.navigate('scanQRCode', {
      isScanDynamicLink: true,
      notAllowGoBack: true,
      callback: (assetCode) => {
        getAssetDetail(assetCode);
      },
    });
  };

  const getAssetDetail = async (code) => {
    getAssetByCode({ code, moduleId: Modules.WORKORDER });
  };

  const rightButtonProps = {
    icon: icons.scanQR,
    size: 50,
    onPress: () => openQRCodeScanner(),
  };

  return (
    <BaseLayout title="WO_REQUEST" showBell rightBtn={rightButtonProps}>
      <Filter
        data={filterData}
        onCompleted={onApplyFilter}
        selectedFilter={selectedFilter}
        defaultFilter={defaultFilter}
        onSearch={onTextSearchChange}
        showFilter={tabIndex === 0}
        searchPlaceHolder={tabIndex === 0 ? 'JR_SEARCH_PLACEHOLDER' : 'TASK_PLACEHOLDER_SEARCH'}
      />
      <SegmentWrapper>
        <SegmentControl
          selectedIndex={tabIndex}
          values={['AD_JR_HEADER_TAB_1', 'AD_JR_HEADER_TAB_2']}
          onChange={onTabChange}
        />
      </SegmentWrapper>
      <AppList {...listProps} />
      {isGranted('WorkOrders.WorkOrder.Create') && <CreateFloatButton {...createButtonProps} />}
      <ESignModal jrData={jrItem} reloadData={() => DeviceEventEmitter.emit('UpdateListWorkOrder')} />

      <WhiteSegmentControl {...(tabIndex === 0 ? jrTypesProps : taskTypesProps)} />
    </BaseLayout>
  );
};

export default JobRequest;
