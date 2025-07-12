import React, { useEffect } from 'react';
import I18n from '@I18n';

import AppList from '../../../Components/Lists/AppList';
import BaseLayout from '../../../Components/Layout/BaseLayout';
import { icons } from '../../../Resources/icon';
import { PAGE_SIZE } from '../../../Config';
import useAttendance from '../../../Context/Attendance/Hooks/UseAttendance';
import { ListAttendanceDetailHeader } from '../../../Components/ItemApp/ItemAttendance/ListAttendanceHeader';
import { ItemAttendanceDetail } from '../../../Components/ItemApp/ItemAttendance';

const DetailAttendance = ({ navigation }) => {
  const id = navigation.getParam('id');
  const {
    attendance: { attendanceListDetail },
    detailAttendance,
  } = useAttendance();

  useEffect(() => {
    getList(1);
  }, []);

  const { data, isRefresh, isLoadMore, currentPage, totalPage } = attendanceListDetail;

  const getList = (page) => {
    detailAttendance({
      page,
      pageSize: PAGE_SIZE,
      userAttendanceId: id,
    });
  };

  const renderItem = (item) => <ItemAttendanceDetail item={item} />;

  const listProps = {
    data,
    isRefresh,
    isLoadMore,
    currentPage,
    totalPage,
    iconName: icons.jobRequestEmpty,
    ListHeaderComponent: ListAttendanceDetailHeader,
    loadData: ({ page }) => getList(page),
    keyExtractor: (item) => item.id.toString(),
    renderItem: ({ item }) => renderItem(item),
  };

  return (
    <BaseLayout title="ATTENDANCE_DETAIL_HISTORY" showBell containerStyle={{ backgroundColor: 'white' }}>
      <AppList {...listProps} />
    </BaseLayout>
  );
};

export default DetailAttendance;
