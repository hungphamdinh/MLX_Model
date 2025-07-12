import React from 'react';
import { DeviceEventEmitter } from 'react-native';
import I18n from '@I18n';
import NavigationService from '@NavigationService';
import AppList from '../../../Components/Lists/AppList';
import BaseLayout from '../../../Components/Layout/BaseLayout';
import { icons } from '../../../Resources/icon';
import useTeam from '../../../Context/Team/Hooks/UseTeam';
import usePlanMaintenance from '../../../Context/PlanMaintenance/Hooks/UsePlanMaintenance';
import ItemPM from '../../../Components/ItemApp/ItemPM';

const PlanTask = () => {
  const {
    planMaintenance: { pmTasks, pmDetail },
    getTasksInPM,
    detailTask,
  } = usePlanMaintenance();

  const { getUserInTeam } = useTeam();

  React.useEffect(() => {
    getList();
  }, []);

  React.useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('UpdateListTaskWorkOrder', getList);
    return () => {
      subscription.remove();
    };
  }, []);

  const { data, isRefresh, isLoadMore, currentPage, totalPage } = pmTasks;

  const getList = () => {
    getTasksInPM(pmDetail.id);
  };

  const gotoDetail = (item) => {
    NavigationService.navigate('editPlanTask');
    detailTask(item.id);
    if (item.team) {
      getUserInTeam(item.team.id);
    }
  };

  const renderItem = (item) => <ItemPM item={item} onPress={() => gotoDetail(item)} />;

  const listProps = {
    data,
    isRefresh,
    isLoadMore,
    currentPage,
    totalPage,
    emptyMsg: I18n.t('AD_IS_EMPTY_TEXT'),
    iconName: icons.jobRequestEmpty,
    loadData: getList,
    keyExtractor: (item, index) => index.toString(),
    renderItem: ({ item }) => renderItem(item),
  };

  return (
    <BaseLayout title="COMMON_TASK">
      <AppList {...listProps} />
    </BaseLayout>
  );
};

export default PlanTask;
