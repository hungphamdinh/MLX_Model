import React, { useEffect, useState } from 'react';
import { DeviceEventEmitter } from 'react-native';
import _ from 'lodash';
import I18n from '@I18n';
import AppList from '../../Components/Lists/AppList';
import BaseLayout from '../../Components/Layout/BaseLayout';
import { icons } from '../../Resources/icon';
import useMeterReading from '../../Context/MeterReading/Hooks/UseMeterReading';
import Filter from '../../Components/Filter';
import { meterReadingPeriods, meterReadingYears } from '../../Config/Constants';
import ItemMeterReading from '../../Components/ItemApp/ItemMeterReading';
import { isGranted } from '../../Config/PermissionConfig';
import { getIsoDateRange } from '../../Utils/convertDate';

const MeterReading = ({ navigation }) => {
  const {
    meterReading: { meterReadings, meterTypes, settings },
    getMeterReadings,
    getMeterTypes,
    getMeterSettings,
  } = useMeterReading();

  const [textSearch, setTextSearch] = useState('');

  const listStatus = [
    {
      name: I18n.t('COMMON_ACTIVE'),
      id: true,
    },
    {
      name: I18n.t('COMMON_INACTIVE'),
      id: false,
    },
  ];

  const defaultFilter = {
    dateRange: {
      fromDate: undefined,
      toDate: undefined,
    },
    isActive: [true],
    year: [`${new Date().getFullYear()}`],
  };

  const filterData = {
    dateRange: {},
    isActive: {
      title: 'COMMON_STATUS',
      multiple: false,
      options: listStatus,
    },
    meterTypeId: {
      title: 'COMMON_TYPE',
      multiple: false,
      options: [...meterTypes],
    },
    period: {
      title: 'METER_READING_PERIOD',
      multiple: false,
      options: [...meterReadingPeriods],
      valKey: 'value',
      fieldName: 'label',
      numOfColumns: 4,
    },
    year: {
      title: 'METER_READING_YEAR',
      multiple: false,
      options: [...meterReadingYears],
      valKey: 'value',
      fieldName: 'label',
      numOfColumns: 3,
    },
    serialNumber: {
      title: 'METER_READING_DEVICE_SERIAL_NAME',
    },
  };

  const [selectedFilter, setSelectedFilter] = useState(defaultFilter);

  React.useEffect(() => {
    getList(1);
  }, [textSearch, selectedFilter]);

  useEffect(() => {
    getMeterTypes();
    getMeterSettings();
  }, []);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('ReloadInventory', () => getList(1));
    return () => {
      subscription.remove();
    };
  }, []);

  const getList = (page) => {
    const { fromDate, toDate } = selectedFilter.dateRange;
    getMeterReadings({
      page,
      keyword: textSearch,
      meterTypeId: _.first(selectedFilter.meterTypeId),
      serialNumber: selectedFilter.serialNumber,
      isActive: _.first(selectedFilter.isActive),
      period: _.first(selectedFilter.period),
      year: _.first(selectedFilter.year),
      ...getIsoDateRange(fromDate, toDate),
    });
  };

  const { data, isRefresh, isLoadMore, currentPage, totalPage } = meterReadings;

  const onApplyFilter = (value) => {
    setSelectedFilter(value);
  };

  const onTextSearchChange = (text) => {
    setTextSearch(text);
    // getList(1, text);
  };

  const onItemPress = (item) => {
    navigation.navigate('meterReadingDetail', { id: item.id, meterDeviceId: item.meterDeviceId });
  };

  const renderItem = (item) => <ItemMeterReading settings={settings} item={item} onPress={() => onItemPress(item)} />;

  const listProps = {
    data,
    isRefresh,
    isLoadMore,
    currentPage,
    totalPage,
    iconName: icons.jobRequestEmpty,
    loadData: ({ page }) => getList(page),
    keyExtractor: (item) => item.id.toString(),
    renderItem: ({ item }) => renderItem(item),
  };

  const openCreateRecord = () => {
    navigation.navigate('createMeterManual');
  };

  const onReceiveCode = (code) => {
    navigation.navigate('createMeterManual', { id: code });
  };

  const openQRCodeScanner = () => {
    navigation.navigate('scanQRCode', { callback: onReceiveCode });
  };

  const rightButtonProps = {
    icon: icons.scanQR,
    size: 50,
    onPress: openQRCodeScanner,
  };
  const mainLayoutProps = {
    onBtAddPress: () => {
      openCreateRecord();
    },
    addPermission: 'MeterReading.Create',
    showBell: true,
    noPadding: true,
    title: I18n.t('METER_READING_TITLE'),
    showAddButton: true,
    rightBtn: isGranted('MeterReading.Create') && rightButtonProps,
  };

  return (
    <BaseLayout {...mainLayoutProps}>
      <Filter
        data={filterData}
        onCompleted={onApplyFilter}
        selectedFilter={selectedFilter}
        defaultFilter={defaultFilter}
        onSearch={onTextSearchChange}
        searchPlaceHolder="COMMON_UNIT_OR_LOCATION"
      />
      <AppList {...listProps} />
    </BaseLayout>
  );
};

export default MeterReading;
