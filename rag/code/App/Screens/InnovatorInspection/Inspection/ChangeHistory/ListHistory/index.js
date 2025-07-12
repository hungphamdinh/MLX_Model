import React, { useEffect } from 'react';
import _ from 'lodash';
import AppList from '../../../../../Components/Lists/AppList';
import useInspection from '../../../../../Context/Inspection/Hooks/UseInspection';
import HistoryItem from '../../../../../Components/InnovatorInspection/HistoryItem';

const ListHistory = ({ workflow }) => {
  const {
    inspection: { changeHistories },
    getChangeHistories,
  } = useInspection();

  useEffect(() => {
    getList();
  }, []);

  const getList = (page = 1) => {
    getChangeHistories({
      page,
      fromDate: workflow.creationTime,
      id: workflow.form?.id,
    });
  };

  const listProps = {
    data: changeHistories.data,
    numColumns: 1,
    showsVerticalScrollIndicator: false,
    isRefresh: changeHistories.isRefresh,
    isLoadMore: changeHistories.isLoadMore,
    currentPage: changeHistories.currentPage,
    totalPage: changeHistories.totalPage,
    loadData: ({ page }) => getList(page),

    renderItem: ({ item, index }) => <HistoryItem item={item} index={index} />,
    keyExtractor: (item) => `${item.id}`,
  };

  return <AppList testID={'app-list'} {...listProps} />;
};
export default ListHistory;
