import React, { useState } from 'react';
import _ from 'lodash';
import NavigationService from '@NavigationService';
import Filter, { FilterTypes } from '@Components/Filter';
import AppList from '../../Components/Lists/AppList';
import BaseLayout from '../../Components/Layout/BaseLayout';
import useTaskManagement from '../../Context/TaskManagement/Hooks/UseTaskManagement';
import ItemTask from '../../Components/ItemApp/ItemTask';
import { PAGE_SIZE } from '../../Config';
import I18n from '../../I18n';
import { convertDate } from '../../Utils';
import useUser from '../../Context/User/Hooks/UseUser';
import useTenant from '../../Context/Tenant/Hooks/UseTenant';
import { ControlOfficePrjId } from '../../Config/Constants';
import { DeviceEventEmitter } from 'react-native';

const TaskManagement = () => {
  const {
    taskManagement: { list, statusList, priorityList, teamList, usersInTeams },
    getTaskList,
    getStatusList,
    getPriorityList,
    getTeamsByTenant,
    getCurrentTeamList,
    getUsersInTeamByTenants,
  } = useTaskManagement();
  const {
    user: { tenant, isControlOffice },
  } = useUser();
  const {
    tenant: { tenantList },
    getTenantList,
  } = useTenant();

  const { data, isRefresh, isLoadMore, currentPage, totalPage } = list;

  const taskTypeList = [
    { id: false, name: I18n.t('SITE') },
    { id: true, name: I18n.t('CONTROL_OFFICE') },
  ];

  const defaultFilter = {
    dateRange: {
      fromDate: undefined,
      toDate: undefined,
    },
    multipleOptions: [],
    tenantFilter: tenant,
    teamIds: [],
    userIds: [],
  };

  const multipleOptionValue = {
    isOverdue: 'isOverdue',
  };

  const getTMTeamList = (tenantId) => {
    const isCurrentTeam = (isControlOffice && tenantId === ControlOfficePrjId) || !isControlOffice;
    if (isCurrentTeam) {
      getCurrentTeamList();
      return;
    }
    getTeamsByTenant({ tenantId });
  };

  React.useEffect(() => {
    const teamIds = _.map(teamList, (team) => team.id);
    getUsersInTeamByTenants({ teamIds, tenantId: filterTenantId });
  }, [teamList]);

  const [selectedFilter, setSelectedFilter] = useState(defaultFilter);
  const [filterTenantId, setFilterTenantId] = useState(tenant?.id);

  const filterData = {
    dateRange: {},
    tenantFilter: {
      title: 'PROJECT',
      multiple: false,
      options: tenantList,
      type: FilterTypes.LIST_SELECT,
      listExist: tenantList.data,
      getList: (_page, keyword) => getTenantList({ filter: keyword }),
      disabled: !isControlOffice,
      onChange: (selectedTenant) => {
        const tenantId = selectedTenant?.id;
        setFilterTenantId(tenantId);
        getTMTeamList(tenantId);
      },
      resetPropsOnChange: ['teamId', 'userId'],
    },
    teamIds: {
      title: 'TEAM_MANAGEMENT',
      type: FilterTypes.DROPDOWN,
      options: teamList,
      dropdownProps: { multiple: true },
    },
    userIds: {
      title: 'ASSIGNEE',
      type: FilterTypes.DROPDOWN,
      fieldName: 'displayName',
      valKey: 'userId',
      options: usersInTeams,
      dropdownProps: { multiple: true },
    },
    statusIds: {
      title: 'COMMON_STATUS',
      multiple: true,
      options: statusList,
    },
    priorityId: {
      title: 'COMMON_PRIORITY',
      multiple: false,
      options: priorityList,
    },
    isPublic: {
      title: 'TASK_TYPE',
      multiple: false,
      options: taskTypeList,
    },
    multipleOptions: {
      multiple: true,
      valKey: 'value',
      options: [
        {
          value: multipleOptionValue.isOverdue,
          name: I18n.t('OVERDUE_ONLY'),
        },
      ],
    },
  };

  const [keyword, setKeyword] = useState('');

  React.useEffect(() => {
    getStatusList();
    getPriorityList();
    getTMTeamList(tenant?.id);
    if (isControlOffice) {
      getTenantList();
    }
    const subscription = DeviceEventEmitter.addListener('ReloadTM', getList);
    return () => {
      subscription.remove();
    };
  }, []);

  React.useEffect(() => {
    getList();
  }, [selectedFilter, keyword]);

  const getList = (page = 1, filter = selectedFilter) => {
    const {
      dateRange: { fromDate, toDate },
      isPublic,
      tenantFilter,
      multipleOptions,
      teamIds,
      userIds,
    } = filter;
    const isOverdue = multipleOptions.includes(multipleOptionValue.isOverdue) || undefined;

    const filterParams = {
      statusIds: filter.statusIds,
      priorityId: filter.priorityId,
      fromDate: fromDate && convertDate.stringToISOString(fromDate),
      toDate: toDate && convertDate.stringToISOString(toDate),
      isOverdue,
      isPublic,
      tenantId: tenantFilter?.id,
      teamIds,
      userIds,
    };

    getTaskList({
      page,
      keyword,
      pageSize: PAGE_SIZE,
      ...filterParams,
    });
  };

  const onApplyFilter = (value) => {
    setSelectedFilter(value);
  };

  const onClearFilter = () => {
    getTMTeamList(filterTenantId);
    setSelectedFilter(defaultFilter);
  };

  const onPressItem = (id) => {
    NavigationService.navigate('editTask', { id });
  };

  const renderItem = (item) => <ItemTask item={item} onPress={() => onPressItem(item.id)} />;

  const onAddTask = () => {
    NavigationService.navigate('addTask');
  };

  const listProps = {
    data,
    isRefresh,
    isLoadMore,
    currentPage,
    totalPage,
    loadData: ({ page }) => getList(page),
    keyExtractor: (item) => item.id.toString(),
    renderItem: ({ item }) => renderItem(item),
    contentContainerStyle: {
      marginTop: 20,
    },
  };

  React.useEffect(() => {
    getList(1);
  }, []);

  const layoutProps = {
    addPermission: 'TaskManagement.Create',
    onBtAddPress: onAddTask,
    showBell: true,
    showAddButton: true,
  };

  return (
    <BaseLayout {...layoutProps} title="TASK_MANAGEMENT_TXT">
      <Filter
        data={filterData}
        onCompleted={onApplyFilter}
        selectedFilter={selectedFilter}
        defaultFilter={defaultFilter}
        searchPlaceHolder="TASK_MGMT_SEARCH_PLACEHOLDER"
        onSearch={(key) => setKeyword(key)}
        onClear={onClearFilter}
      />
      <AppList {...listProps} />
    </BaseLayout>
  );
};

export default TaskManagement;
