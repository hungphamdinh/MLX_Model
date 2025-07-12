import React, { useEffect, useState } from 'react';
import { DeviceEventEmitter } from 'react-native';
import I18n from '@I18n';
import NavigationService from '@NavigationService';
import AppList from '../../Components/Lists/AppList';
import BaseLayout from '../../Components/Layout/BaseLayout';
import { icons } from '../../Resources/icon';
import Filter, { FilterTypes } from '../../Components/Filter';
import ItemVisitor from '../../Components/ItemApp/ItemVisitor';
import useVisitor from '../../Context/Visitor/Hooks/UseVisitor';
import toast from '../../Utils/toast';
import useHome from '../../Context/Home/Hooks/UseHome';
import useUser from '@Context/User/Hooks/UseUser';
import _ from 'lodash';

const VisitorScreen = () => {
  const {
    visitor: { visitors },
    getAllVisitors,
    getVisitorReasons,
    scanQRVisitor,
  } = useVisitor();

  const {
    home: { buildings, companies },
    getCompanies,
  } = useHome();

  const {
    user: { isOfficeSite },
  } = useUser();

  const [textSearch, setTextSearch] = useState('');

  const filterBuildings = React.useMemo(() => [...buildings], [buildings]);

  const defaultFilter = {
    buildingId: 'all',
    companyId: 'all',
  };

  const filterData = {
    ...(!isOfficeSite && {
      buildingId: {
        title: 'COMMON_BUILDING',
        type: FilterTypes.DROPDOWN,
        options: filterBuildings,
      },
    }),
    ...(isOfficeSite && {
      companyId: {
        title: 'COMPANY',
        options: companies,
        listExist: companies.data,
        fieldName: 'companyRepresentative',
        titleKey: 'companyRepresentative',
        getList: (page, keyword) =>
          getCompanies({
            page,
            keyword,
          }),
        type: FilterTypes.LIST_SELECT,
      },
    }),
    isInactive: {
      multiple: true,
      options: [
        {
          id: 1,
          name: I18n.t('DEACTIVATED_ONLY'),
        },
      ],
    },
  };

  const [selectedFilter, setSelectedFilter] = useState(defaultFilter);

  useEffect(() => {
    getVisitorReasons();
  }, []);

  React.useEffect(() => {
    getList(1);
  }, [textSearch, selectedFilter]);

  React.useEffect(() => {
    getCompanies();
    const subscription = DeviceEventEmitter.addListener('UpdateListVisitor', getList);
    return () => {
      subscription.remove();
    };
  }, []);

  const { data, isRefresh, isLoadMore, currentPage, totalPage } = visitors;

  const getList = (page = 1) => {
    const buildingId = selectedFilter.buildingId === 'all' ? undefined : selectedFilter.buildingId;
    const companyId = selectedFilter.companyId === 'all' ? undefined : selectedFilter.companyId;
    const isInactive = _.first(selectedFilter.isInactive) === 1;

    getAllVisitors({
      page,
      keyword: textSearch,
      buildingId,
      companyId: companyId?.id,
      isActive: !isInactive,
      sorting: 'createdAt desc',
    });
  };

  const onApplyFilter = (value) => {
    setSelectedFilter(value);
  };

  const onTextSearchChange = (text) => {
    setTextSearch(text);
  };

  const gotoDetail = (id) => {
    NavigationService.navigate('visitorDetail', {
      id,
    });
  };

  const onBtAddPress = () => {
    NavigationService.navigate('addVisitor');
  };

  const onReceiveCode = async (code) => {
    const response = await scanQRVisitor({ code });
    if (!response) {
      toast.showError(I18n.t('VISITOR_QR_NOT_FOUND'));
      return;
    }
    NavigationService.navigate('visitorDetail', {
      id: response.visitorId,
    });
  };

  const onScanQRPress = () => {
    NavigationService.navigate('scanQRCode', { callback: onReceiveCode });
  };

  const renderItem = (item) => <ItemVisitor item={item} onPress={() => gotoDetail(item.visitorId)} />;

  const listProps = {
    data,
    isRefresh,
    isLoadMore,
    currentPage,
    totalPage,
    iconName: icons.jobRequestEmpty,
    loadData: ({ page }) => getList(page),
    keyExtractor: (item) => item.visitorId.toString(),
    renderItem: ({ item }) => renderItem(item),
  };

  return (
    <BaseLayout
      title="VISITOR_MANAGEMENT_TITLE"
      showBell
      rightBtn={{
        icon: icons.scanQR,
        size: 50,
        onPress: onScanQRPress,
      }}
      onBtAddPress={onBtAddPress}
      showAddButton
      addPermission="Visitors.Create"
    >
      <Filter
        data={filterData}
        onCompleted={onApplyFilter}
        selectedFilter={selectedFilter}
        defaultFilter={defaultFilter}
        onSearch={onTextSearchChange}
        searchPlaceHolder="VISITOR_PLACEHOLDER_SEARCH"
      />

      <AppList {...listProps} />
    </BaseLayout>
  );
};

export default VisitorScreen;
