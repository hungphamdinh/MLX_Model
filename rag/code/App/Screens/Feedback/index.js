import React, { useState } from 'react';
import { DeviceEventEmitter } from 'react-native';
import NavigationService from '@NavigationService';
import styled from 'styled-components/native';
import _ from 'lodash';
import { icons } from '../../Resources/icon';
import AppList from '../../Components/Lists/AppList';
import BaseLayout from '../../Components/Layout/BaseLayout';
import useFeedback from '../../Context/Feedback/Hooks/useFeedback';
import SegmentControl from '../../Components/segmentControl';
import { Colors } from '../../Themes';
import Filter, { FilterTypes } from '../../Components/Filter';
import { convertDate } from '../../Utils';
import { PAGE_SIZE } from '../../Config';
import ItemFB from '../../Components/ItemApp/ItemFB';
import { Modules } from '../../Config/Constants';

const SegmentWrapper = styled.View`
  background-color: ${Colors.bgWhite};
  padding: 10px;
`;

const tab = {
  feedback: 0,
  qrFeedback: 0,
};
const Feedback = () => {
  const {
    feedback: { list, categories, types, listQRFeedback, locations, statusList, divisionList, qrFeedbackSetting },
    getListFB,
    getCategories,
    getListQRFeedback,
    getTypes,
    getLocations,
    getFeedbackStatus,
    getQrFeedbackSetting,
    getFeedbackDivision,
  } = useFeedback();

  const defaultFilter = {
    dateRange: {
      fromDate: undefined,
      toDate: undefined,
    },
  };

  const filterFeedback = {
    dateRange: {},
    statusIds: {
      title: 'COMMON_STATUS',
      multiple: true,
      options: statusList,
    },
    types: {
      title: 'COMMON_TYPE',
      options: types,
    },
    categories: {
      title: 'COMMON_CATEGORY',
      options: categories,
    },
  };

  const divisionFilterControl = {
    commentBoxDivisionId: {
      title: 'DIVISION',
      type: FilterTypes.DROPDOWN,
      options: divisionList,
    },
  };

  const filterQRFeedback = {
    dateRange: {},
    commentBoxTypeId: {
      title: 'COMMON_TYPE',
      options: types,
    },
    phoneNumber: {
      title: 'COMMON_PHONE_NUMBER',
    },
    commentBoxLocationId: {
      title: 'COMMON_LOCATION',
      options: locations,
      listExist: locations.data,
      getList: (page, keyword) =>
        getLocations({
          page,
          keyword,
        }),
      type: FilterTypes.LIST_SELECT,
    },
    ...(qrFeedbackSetting?.canViewDivision && divisionFilterControl),
  };
  const [tabIndex, setTabIndex] = useState(0);
  const isTabFeedback = tabIndex === tab.feedback;

  const [feedbackFilter, setFeedbackFilter] = useState(defaultFilter);
  const [qrFeedbackFilter, setQRFeedbackFilter] = useState(defaultFilter);
  const [selectedFilter, setSelectedFilter = !isTabFeedback ? setQRFeedbackFilter : setFeedbackFilter] = useState(
    isTabFeedback ? feedbackFilter : qrFeedbackFilter
  );

  const [textSearch, setTextSearch] = useState('');

  React.useEffect(() => {
    getCategories();
    getTypes();
    getFeedbackStatus();
    getFeedbackDivision();
    getQrFeedbackSetting();
    getLocations({
      page: 1,
    });
  }, []);

  React.useEffect(() => {
    getList(1);
  }, [textSearch, selectedFilter]);

  React.useEffect(() => {
    const getData = () => getList(1, textSearch, selectedFilter);
    const subscriber = DeviceEventEmitter.addListener('UpdateListFeedback', () => getData());
    return () => {
      subscriber.remove();
    };
  }, [tabIndex]);

  const getValueForOptions = (feedback, qrFeedback) => {
    if (tabIndex === tab.feedback) {
      return feedback;
    }
    return qrFeedback;
  };
  const listData = getValueForOptions(list, listQRFeedback);
  const { data, isRefresh, isLoadMore, currentPage, totalPage } = listData;

  const getList = (page = 1, keyword = textSearch, filter = selectedFilter) => {
    const { fromDate, toDate } = filter.dateRange;
    const getData = tabIndex === tab.feedback ? getListFB : getListQRFeedback;
    const filterParams = {
      ...selectedFilter,
      fromDate: fromDate && convertDate.stringToISOString(fromDate),
      toDate: toDate && convertDate.stringToISOString(toDate),
      commentBoxLocationId: filter.commentBoxLocationId?.id,
    };

    getData({
      page,
      pageSize: PAGE_SIZE,
      keyword,
      ...filterParams,
    });
  };

  const clearFilter = () => {
    setSelectedFilter(_.cloneDeep(defaultFilter) || {});
  };

  const onApplyFilter = (value) => {
    setSelectedFilter(value);
  };

  const onBtAddPress = () => {
    NavigationService.navigate('addFeedback');
  };

  const onTextSearchChange = (text) => {
    setTextSearch(text);
    // getList(1, text);
  };

  const gotoDetail = (item) => {
    NavigationService.navigate(isTabFeedback ? 'editFeedback' : 'editQRFeedback', {
      id: item.id,
    });
  };

  const onTabChange = (index) => {
    setTabIndex(index);
    clearFilter();
  };

  const renderItem = (item) => (
    <ItemFB
      moduleId={isTabFeedback ? Modules.FEEDBACK : Modules.QR_FEEDBACK}
      item={item}
      onPress={() => gotoDetail(item)}
    />
  );

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
    <BaseLayout
      addPermission="Feedbacks.Create"
      showAddButton={isTabFeedback}
      onBtAddPress={!isTabFeedback ? null : onBtAddPress}
      title="HOME_TEXT_FEEDBACK"
      showBell
    >
      <Filter
        data={isTabFeedback ? filterFeedback : filterQRFeedback}
        onCompleted={onApplyFilter}
        selectedFilter={selectedFilter}
        defaultFilter={defaultFilter}
        onSearch={onTextSearchChange}
        searchPlaceHolder={tabIndex === 0 ? 'FB_SEARCH_PLACEHOLDER' : 'QR_FB_SEARCH_PLACEHOLDER'}
      />
      <SegmentWrapper>
        <SegmentControl
          selectedIndex={tabIndex}
          values={['FEEDBACK_HEADER_TAB', 'FEEDBACK_QR_HEADER_TAB']}
          onChange={onTabChange}
        />
      </SegmentWrapper>
      <AppList {...listProps} />
    </BaseLayout>
  );
};

export default Feedback;
