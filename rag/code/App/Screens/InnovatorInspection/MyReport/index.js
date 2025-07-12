import React, { useState } from 'react';
import _ from 'lodash';
import MyReportItem from '@Components/InnovatorInspection/MyReportItem';
import AppList from '@Components/Lists/AppList';
import LoaderContainer from '@Components/Layout/LoaderContainer';
import BaseLayout from '@Components/Layout/BaseLayout';
import Filter from '@Components/Filter';
import useInspection from '@Context/Inspection/Hooks/UseInspection';

const MyReport = () => {
  const {
    getMyReports,
    viewMyReport,
    inspection: { myReports },
  } = useInspection();

  const { data, isLoadMore, isRefresh, currentPage, totalPage } = myReports;
  const [keyword, setKeyword] = useState('');

  React.useEffect(() => {
    getList(1);
  }, [keyword]);

  const getList = (page = 1, text = keyword) => {
    const params = {
      page,
      keyword: text,
    };
    getMyReports(params);
  };

  const onSearch = (text) => {
    setKeyword(text);
  };

  const onItemPress = (item) => {
    viewMyReport(item);
  };

  const listProps = {
    data,
    numColumns: 1,
    style: { flex: 1 },
    isRefresh,
    isLoadMore,
    currentPage,
    totalPage,
    loadData: getMyReports,
    renderItem: ({ item }) => <MyReportItem item={item} onItemPress={onItemPress} />,
    keyExtractor: (item) => `${item.id}`,
  };

  const mainLayoutProps = {
    style: { flex: 1 },
    showBell: true,
    showLogo: true,
    showAddButton: false,
    title: 'MY_REPORT_TXT',
  };

  return (
    <BaseLayout {...mainLayoutProps}>
      <Filter showFilter={false} searchPlaceHolder="MY_REPORT_SEARCH" onSearch={onSearch} />
      <LoaderContainer isLoading={isRefresh}>
        <AppList {...listProps} />
      </LoaderContainer>
    </BaseLayout>
  );
};

export default MyReport;
