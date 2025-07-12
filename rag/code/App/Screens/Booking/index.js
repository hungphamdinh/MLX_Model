import React, { useEffect, useMemo, useState } from 'react';
import { DeviceEventEmitter } from 'react-native';
import NavigationService from '@NavigationService';
import { icons } from '../../Resources/icon';
import AppList from '../../Components/Lists/AppList';
import BaseLayout from '../../Components/Layout/BaseLayout';
import useBooking from '../../Context/Booking/Hooks/useBooking';
import Filter, { FilterTypes } from '../../Components/Filter';
import { convertDate } from '../../Utils';
import { PAGE_SIZE } from '../../Config';
import ItemBooking from '../../Components/ItemApp/ItemBooking';
import I18n from '../../I18n';
import SelectAmenityModal from '../../Components/Booking/SelectAmenityModal';
import { getDefaultDateRange } from '../../Utils/convertDate';

const Booking = () => {
  const {
    booking: { statusList, paymentStatusList, amenitiesFilter, amenityList, list },
    filterBookings,
    getBookingStatus,
    getPaymentStatus,
    getAmenities,
    getAmenityDetail,
  } = useBooking();

  const multipleOptionValue = {
    isIncludeExpired: 'isIncludeExpired',
    onlyActiveAmenity: 'onlyActiveAmenity',
  };

  const defaultFilter = {
    dateRange: getDefaultDateRange(),
    statusIds: [],
    isIncludeExpired: false,
    paymentStatusIds: [],
    amenityIds: [],
    multipleOptions: [multipleOptionValue.onlyActiveAmenity],
  };

  const filters = {
    dateRange: {},
    statusIds: {
      title: 'COMMON_STATUS',
      multiple: true,
      options: statusList,
      valKey: 'statusCode',
    },
    paymentStatusIds: {
      title: 'COMMON_PAYMENT_STATUS',
      options: paymentStatusList,
      multiple: true,
      valKey: 'paymentStatusCode',
    },
    amenityIds: {
      title: 'BOOKING_AMENITES',
      multiple: true,
      type: FilterTypes.DROPDOWN,
      options: amenitiesFilter,
      valKey: 'amenityId',
      fieldName: 'amenityName',
      dropdownProps: {
        showSearchBar: true,
      }
    },
    multipleOptions: {
      multiple: true,
      valKey: 'value',
      options: [
        {
          value: multipleOptionValue.onlyActiveAmenity,
          name: I18n.t('BOOKING_ONLY_ACTIVE_AMENITY'),
        },
        {
          value: multipleOptionValue.isIncludeExpired,
          name: I18n.t('BOOKING_INCLUDE_EXPIRED'),
        },
      ],
    },
  };

  const [bookingFilter, setBookingFilter] = useState(defaultFilter);
  const [selectedFilter, setSelectedFilter = setBookingFilter] = useState(bookingFilter);

  const [textSearch, setTextSearch] = useState('');
  const [visibleSelectAmenity, setVisibleSelectAmenity] = useState(false);

  useEffect(() => {
    getBookingStatus();
    getPaymentStatus();
    getAmenities();
  }, []);

  useEffect(() => {
    getList(1);
  }, [textSearch, selectedFilter]);

  useEffect(() => {
    const getData = () => getList(1, textSearch, selectedFilter);
    const subscriber = DeviceEventEmitter.addListener('UpdateListBooking', () => getData());
    return () => {
      subscriber.remove();
    };
  }, []);

  const onCloseSelectAmenity = () => {
    setVisibleSelectAmenity(false);
  };

  const onAmenitySelect = async (amenity) => {
    setVisibleSelectAmenity(false);
    getAmenityDetail(amenity.amenityId);
    NavigationService.navigate('addBooking');
  };

  const { data, isRefresh, isLoadMore, currentPage, totalPage } = list;

  const getList = (page = 1, keyword = textSearch, filter = selectedFilter) => {
    const { fromDate, toDate } = filter.dateRange;
    const isIncludeExpired = filter.multipleOptions.includes(multipleOptionValue.isIncludeExpired) || null;
    const onlyActiveAmenity = filter.multipleOptions.includes(multipleOptionValue.onlyActiveAmenity) || null;
    const filterParams = {
      ...selectedFilter,
      fromDate: fromDate && convertDate.stringToISOString(fromDate),
      toDate: toDate && convertDate.stringToISOString(toDate),
      isIncludeExpired,
      onlyActiveAmenity,
      sorting: 'createdAt desc',
    };

    filterBookings({
      page,
      pageSize: PAGE_SIZE,
      keyword,
      ...filterParams,
    });
  };

  const onApplyFilter = (value) => {
    setSelectedFilter(value);
  };

  const onBtAddPress = () => {
    setVisibleSelectAmenity(true);
  };

  const onTextSearchChange = (text) => {
    setTextSearch(text);
  };

  const gotoDetail = (item) => {
    NavigationService.navigate('editBooking', {
      id: item.reservationId,
    });
  };

  const renderItem = (item) => <ItemBooking item={item} onPress={() => gotoDetail(item)} />;

  const listProps = {
    data,
    isRefresh,
    isLoadMore,
    currentPage,
    totalPage,
    iconName: icons.jobRequestEmpty,
    loadData: ({ page }) => getList(page),
    keyExtractor: (item) => `${item.id}`,
    renderItem: ({ item }) => renderItem(item),
  };

  return (
    <BaseLayout onBtAddPress={onBtAddPress} title="HOME_TEXT_BOOKING" showBell showAddButton>
      <Filter
        data={filters}
        onCompleted={onApplyFilter}
        selectedFilter={selectedFilter}
        defaultFilter={defaultFilter}
        onSearch={onTextSearchChange}
        searchPlaceHolder="BOOKING_SEARCH_PLACEHOLDER"
      />
      <AppList {...listProps} />
      <SelectAmenityModal
        visible={visibleSelectAmenity}
        onClose={onCloseSelectAmenity}
        onSelect={onAmenitySelect}
        data={amenityList}
      />
    </BaseLayout>
  );
};

export default Booking;
