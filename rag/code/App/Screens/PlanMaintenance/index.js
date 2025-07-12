/* eslint-disable no-unused-expressions */
/* eslint-disable no-shadow */
/* @flow */

import get from 'lodash/get';
import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import I18n from '@I18n';
import moment from 'moment';
import LoaderContainer from '@Components/Layout/LoaderContainer';
import ListPlaceholder from '@Components/Lists/Placeholders/ListPlaceholder';
import styled from 'styled-components/native';
import { DeviceEventEmitter, InteractionManager, View } from 'react-native';
import { Colors } from '../../Themes';

import TaskList from './TabTask';

import Filter from '../../Components/Filter';
import SegmentControl from '../../Components/segmentControl';
import usePlanMaintenance from '../../Context/PlanMaintenance/Hooks/UsePlanMaintenance';
import BaseLayout from '../../Components/Layout/BaseLayout';
import { icons } from '../../Resources/icon';
import WhiteSegmentControl from '../../Components/WhiteSegmentControl';
import { DashboardStatisticTypes, Modules, PM_SORT_TYPE } from '../../Config/Constants';
import { isGrantedAny } from '../../Config/PermissionConfig';
import useInspection from '../../Context/Inspection/Hooks/UseInspection';
import useForm from '../../Context/Form/Hooks/UseForm';
import ListPM from './ListPM';
import useUser from '../../Context/User/Hooks/UseUser';
import useAsset from '../../Context/Asset/Hooks/UseAsset';
import { useRoute } from '@react-navigation/native';

const SegmentWrapper = styled.View`
  background-color: ${Colors.bgWhite};
  padding: 10px;
`;

const ListPlanMaintenance = ({ navigation, route }) => {
  const listSorts = [
    {
      type: PM_SORT_TYPE.CREATED_DATE,
      id: 1,
      name: 'COMMON_CREATED_DATE',
      isAsc: true,
    },
    {
      type: PM_SORT_TYPE.CREATED_DATE,
      id: 2,
      name: 'COMMON_CREATED_DATE',
    },
    {
      type: PM_SORT_TYPE.TARGET_EXECUTION_DATE,
      id: 3,
      name: 'PM_TARGET_EXECUTION_DATE',
      isAsc: true,
    },
    {
      type: PM_SORT_TYPE.TARGET_EXECUTION_DATE,
      id: 4,
      name: 'PM_TARGET_EXECUTION_DATE',
      isDefault: true,
    },
  ];
  const { params } = useRoute();

  const statusIds = params?.statusIds;
  const statisticType = params?.statisticType;

  const defaultFilter = {
    dateRange: {
      fromDate: undefined,
      toDate: undefined,
    },
  };

  const [selectedFilter, setSelectedFilter] = useState({
    dateRange: defaultFilter.dateRange,
  });
  const [selectedSort, setSelectedSort] = useState({
    sortIds: listSorts.filter((item) => item.isDefault),
  });

  const [tabFilter, setTabFilter] = useState({
    groupIndex: 0,
    planTab: 0,
    taskTab: 0,
  });
  const isPM = tabFilter.groupIndex === 0;
  const [keyword, setKeyword] = useState('');
  const {
    getAllPM,
    getPlanTask,
    getMyPM,
    getMyTeamPM,
    getMyPlanTask,
    getFilterPlanCategory,
    getPriorities,
    planMaintenance: {
      list,
      taskList,
      myList,
      myTeamList,
      myTaskList,
      priorities,
      groupCategories: { status, teams },
    },
  } = usePlanMaintenance();
  const { getStatusConfigs, getInspectionSetting } = useInspection();
  const { getAllFormQuestionAnswerTemplate, getFormSetting, getFormCategories } = useForm();
  const { getAssetByCode } = useAsset();

  const filterData = {
    dateRange: {
      title: 'PM_TARGET_EXECUTION_DATE',
    },
    statusIds: {
      title: 'COMMON_STATUS',
      multiple: true,
      options: status ? status.data : [],
    },
    priorityIds: {
      title: 'COMMON_PRIORITY',
      multiple: true,
      options: priorities,
    },
    teamIds: {
      title: 'COMMON_TEAMS',
      options: teams ? teams.data : [],
    },
    isOverdue: {
      multiple: true,
      options: [
        {
          id: 1,
          name: I18n.t('COMMON_OVERDUE'),
        },
      ],
    },
  };

  const sortData = {
    sortIds: {
      title: 'COMMON_SORT_BY',
      options: listSorts,
    },
  };

  React.useEffect(() => {
    if (statisticType && statusIds) {
      const planTab = statisticType - DashboardStatisticTypes.PLAN_MAINTENANCE;
      setTabFilter({
        planTab,
        groupIndex: 0,
        taskTab: 0,
      });

      if (statusIds) {
        // onTabChange(0);
        const newSelectedFilter = {
          ...selectedFilter,
          statusIds,
        };
        setSelectedFilter(newSelectedFilter);
        requestGetListPlan(1, '', newSelectedFilter, planTab);
      }
    }
  }, [statisticType, statusIds]);

  useEffect(() => {
    initData();
  }, []);

  const initData = () => {
    const pmSubscription = DeviceEventEmitter.addListener('update_pm', () => requestGetListPlan());
    InteractionManager.runAfterInteractions(() => {
      requestGetTaskList();
    });
    const taskSubscription = DeviceEventEmitter.addListener('update_list_task_plan', () => {
      requestGetTaskList();
    });

    getAllFormQuestionAnswerTemplate();
    getStatusConfigs();
    getFormSetting();
    if(!params?.statusIds) {
      requestGetListPlan();
    }
    getPriorities();
    requestGetFilterPlanCategories();
    getFormCategories();
    getInspectionSetting();
    return () => {
      pmSubscription.remove();
      taskSubscription.remove();
    };
  };

  const requestGetTaskList = async (currentPage = 1, keyword = '', tab = 0) => {
    const params = {
      page: currentPage,
      PageSize: 20,
      keyword,
      StatusIds: '',
    };
    tab === 0 ? getPlanTask(params) : getMyPlanTask(params);
  };

  const requestGetListPlan = async (
    currentPage = 1,
    key = keyword,
    currentFilter = selectedFilter,
    tab = tabFilter.planTab,
    currentSort = selectedSort
  ) => {
    const fromDate = get(currentFilter.dateRange, 'fromDate') || false;
    const toDate = get(currentFilter.dateRange, 'toDate') || false;
    const statusIds = get(currentFilter, 'statusIds') || [];
    const priorityIds = get(currentFilter, 'priorityIds') || [];
    const teamIds = get(currentFilter, 'teamIds') || [];
    const isOverdue = get(currentFilter, 'isOverdue') || [];
    const sortData = _.first(get(currentSort, 'sortIds'));

    const params = {
      isOverdue: !!_.first(isOverdue),
      page: currentPage,
      pageSize: 20,
      keyword: key,
      teamIds,
      priorityIds,
      statusIds,
      fromDate: fromDate ? moment(fromDate).format() : undefined,
      toDate: toDate ? moment(toDate).format() : undefined,
      isDescending: sortData ? !sortData.isAsc : true,
      orderByColumn: sortData ? sortData.type : PM_SORT_TYPE.ID,
    };
    const getPM = getValueByTabIndex(tab, getAllPM, getMyTeamPM, getMyPM);
    getPM(params);
  };

  const getValueByTabIndex = (index, ...data) => data[index];

  const requestGetFilterPlanCategories = () => {
    getFilterPlanCategory();
  };

  const onChangTextKeyword = async (text) => {
    setKeyword(text);
    isPM ? requestGetListPlan(1, text) : requestGetTaskList(1, text);
  };

  const onListTabIndexChange = (index) => {
    const filter = isPM
      ? {
          ...tabFilter,
          planTab: index,
        }
      : {
          ...tabFilter,
          taskTab: index,
        };

    setTabFilter(filter);
    DeviceEventEmitter.addListener('update_pm', () => requestGetListPlan(1, keyword, selectedFilter, index));
    isPM ? requestGetListPlan(1, keyword, selectedFilter, index, selectedSort) : requestGetTaskList(1, keyword, index);
  };

  const openCreatePlan = () => {
    navigation.navigate('createPlan', {
      onCreateSuccess: () => DeviceEventEmitter.emit('update_pm'),
    });
  };

  const onTabChange = (groupIndex) => {
    setTabFilter({ ...tabFilter, groupIndex });
  };

  const onSubmitFilter = async (params = selectedFilter) => {
    setSelectedFilter(params);
    reloadList(params);
  };

  const onSubmitSort = async (params = selectedSort) => {
    setSelectedSort(params);
    reloadList(selectedFilter, params);
  };

  const reloadList = async (currentFilter = selectedFilter, currentSort = selectedSort) => {
    DeviceEventEmitter.addListener('update_pm', () =>
      requestGetListPlan(1, keyword, currentFilter, tabFilter.planTab, currentSort)
    );
    await requestGetListPlan(1, keyword, currentFilter, tabFilter.planTab, currentSort);
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
    getAssetByCode({
      code,
      moduleId: Modules.PLANMAINTENANCE,
    });
  };

  const rightButtonProps = {
    icon: icons.scanQR,
    size: 50,
    onPress: () => openQRCodeScanner(),
  };
  const mainLayoutProps = {
    onBtAddPress: () => {
      openCreatePlan();
    },
    addPermission: 'PlanMaintenance.Create',
    showBell: true,
    noPadding: true,
    title: I18n.t('AD_PM_TITLE_HEADER'),
    showAddButton: true,
    addBottomMargin: 60,
    rightBtn: isGrantedAny('PlanMaintenance.Create', 'PlanMaintenance.Update') && rightButtonProps,
  };

  const renderTask = (listData) => (
    <View tabLabel={I18n.t('AD_PM_HEADER_TAB_2')} style={{ flex: 1 }}>
      <TaskList navigation={navigation} taskList={listData} requestGetTaskList={requestGetTaskList} />
    </View>
  );

  const renderList = (listData) => (
    <View style={{ flex: 1 }}>
      <LoaderContainer isLoading={listData.isRefresh} loadingComponent={<ListPlaceholder />}>
        <ListPM navigation={navigation} data={listData} getData={requestGetListPlan} />
      </LoaderContainer>
    </View>
  );

  return (
    <BaseLayout {...mainLayoutProps}>
      <Filter
        data={filterData}
        sortData={tabFilter.groupIndex === 0 && sortData ? sortData : null}
        onCompleted={onSubmitFilter}
        onSortCompleted={onSubmitSort}
        selectedFilter={selectedFilter}
        defaultFilter={defaultFilter}
        selectedSort={selectedSort}
        onSearch={onChangTextKeyword}
        showFilter={tabFilter.groupIndex === 0}
        searchPlaceHolder={tabFilter.groupIndex === 0 ? 'PM_PLACEHOLDER_SEARCH' : 'TASK_PLACEHOLDER_SEARCH'}
      />
      <SegmentWrapper>
        <SegmentControl
          selectedIndex={tabFilter.groupIndex}
          values={['AD_PM_HEADER_TAB_1', 'AD_PM_HEADER_TAB_2']}
          onChange={onTabChange}
        />
      </SegmentWrapper>

      <View style={{ flex: 1, backgroundColor: Colors.bgMain }}>
        {isPM ? (
          <>{renderList(getValueByTabIndex(tabFilter.planTab, list, myTeamList, myList))}</>
        ) : (
          <>{renderTask(getValueByTabIndex(tabFilter.taskTab, taskList, myTaskList))}</>
        )}
        <WhiteSegmentControl
          selectedIndex={isPM ? tabFilter.planTab : tabFilter.taskTab}
          values={isPM ? ['AD_PM_ALL_PM', 'AD_PM_MY_TEAM_PM', 'AD_PM_MY_PM'] : ['AD_TASK_ALL_TASK', 'AD_TASK_MY_TASK']}
          onChange={onListTabIndexChange}
        />
      </View>
    </BaseLayout>
  );
};

export default ListPlanMaintenance;
