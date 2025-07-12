import React, { useEffect, useState } from 'react';
import { DeviceEventEmitter } from 'react-native';
import NavigationService from '@NavigationService';

import AppList from '../../Components/Lists/AppList';
import BaseLayout from '../../Components/Layout/BaseLayout';
import { icons } from '../../Resources/icon';
import useAttendance from '../../Context/Attendance/Hooks/UseAttendance';
import Filter from '../../Components/Filter';
import ItemAttendance from '../../Components/ItemApp/ItemAttendance';
import { convertDate } from '../../Utils';
import useTeam from '../../Context/Team/Hooks/UseTeam';
import ListAttendanceHeader from '../../Components/ItemApp/ItemAttendance/ListAttendanceHeader';
import AddAttendanceButton from '../../Components/Attendance/AddAttendanceButton';
import { isGranted } from '../../Config/PermissionConfig';

const Attendance = () => {
  const {
    attendance: { attendances },
    getAllAttendances,
    getDistanceArea,
  } = useAttendance();
  const {
    team: { attendanceTeams },
    getTeamAttendance,
  } = useTeam();
  const [textSearch, setTextSearch] = useState('');

  const defaultFilter = {
    dateRange: {
      fromDate: undefined,
      toDate: undefined,
    },
  };

  const filterData = {
    dateRange: {
      title: 'COMMON_CREATED_DATE',
    },
    teamIds: {
      title: 'COMMON_TEAMS',
      options: attendanceTeams,
    },
  };

  const [selectedFilter, setSelectedFilter] = useState(defaultFilter);

  useEffect(() => {
    getTeamAttendance();
    getDistanceArea();
  }, []);

  React.useEffect(() => {
    getList(1);
  }, [textSearch, selectedFilter]);

  React.useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('AddOrEditAttendanceSuccess', getList);
    return () => {
      subscription.remove();
    };
  }, []);

  const { data, isRefresh, isLoadMore, currentPage, totalPage } = attendances;

  const getList = (page) => {
    const { fromDate, toDate } = selectedFilter.dateRange;

    getAllAttendances({
      page,
      keyword: textSearch,
      teamId: selectedFilter.teamIds,
      fromDate: fromDate && convertDate.stringToISOString(fromDate),
      toDate: toDate && convertDate.stringToISOString(toDate),
    });
  };

  const onApplyFilter = (value) => {
    setSelectedFilter(value);
  };

  const onTextSearchChange = (text) => {
    setTextSearch(text);
    // getList(1, text);
  };

  const gotoDetail = (id) => {
    NavigationService.navigate('detailAttendance', {
      id,
    });
  };

  const btAttendancePress = () => {
    NavigationService.navigate('addAttendance');
  };

  const renderItem = (item) => <ItemAttendance item={item} onPress={() => gotoDetail(item.id)} />;

  const listProps = {
    data,
    isRefresh,
    isLoadMore,
    currentPage,
    totalPage,
    iconName: icons.jobRequestEmpty,
    ListHeaderComponent: ListAttendanceHeader,
    loadData: ({ page }) => getList(page),
    keyExtractor: (item) => item.id.toString(),
    renderItem: ({ item }) => renderItem(item),
    contentContainerStyle: {
      marginTop: 0,
    },
  };

  return (
    <BaseLayout title="AD_CHEHCKIN_TITLE_HEADER" showBell containerStyle={{ backgroundColor: 'white' }}>
      <Filter
        spaceStyle={{ marginBottom: 0, height: 40 }}
        data={filterData}
        onCompleted={onApplyFilter}
        selectedFilter={selectedFilter}
        defaultFilter={defaultFilter}
        onSearch={onTextSearchChange}
        customView={isGranted('Attendance.Create') && <AddAttendanceButton onPress={btAttendancePress} />}
      />
      <AppList {...listProps} />
    </BaseLayout>
  );
};

export default Attendance;
