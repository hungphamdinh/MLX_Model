import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import _ from 'lodash';
import I18n from '@I18n';
import { NavigationEvents } from '@react-navigation/compat';
import PropertyItem from '@Components/InnovatorInspection/PropertyItem';
import useProperty from '@Context/Property/Hooks/UseProperty';
import AppList from '@Components/Lists/AppList';
import LoaderContainer from '@Components/Layout/LoaderContainer';
import ListPlaceholder from '@Components/Lists/Placeholders/ListPlaceholder';
import useSync from '@Context/Sync/Hooks/UseSync';
import useHome from '@Context/Home/Hooks/UseHome';
import BaseLayout from '@Components/Layout/BaseLayout';
import { getNonOfflineInspectionProps } from '../../Inspection/InspectionHome';

import Filter from '../../../../Components/Filter';

import styles from './styles';
import { InspectionPropertyOrderByColumn } from '../../../../Config/Constants';
import useFeatureFlag from '../../../../Context/useFeatureFlag';

const PropertyScreen = ({ navigation }) => {
  const {
    property: { properties, offlineProperties },
    getProperties,
    getDetailProperty,
    getOfflineProperties,
  } = useProperty();

  const isSelect = _.get(navigation, 'state.routeName') === 'selectProperty';
  const { isEnableLiveThere } = useFeatureFlag();
  const propertyName = isEnableLiveThere ? 'PROPERTY_REFERENCE_NUMBER' : 'PROPERTY_NAME';

  // console.log('property is ', property, isLoading);
  const { doSynchronize } = useSync();
  const {
    home: { isOfflineInspection },
  } = useHome();

  const getListData = isSelect ? getOfflineProperties : getProperties;
  const listData = isSelect ? offlineProperties : properties;
  const { data, isLoadMore, isRefresh, currentPage, totalPage } = listData;
  const [selectedFilter, setSelectedFilter] = useState({ sortIds: [] });
  const [keyword, setKeyword] = useState('');

  const listSorts = [
    {
      id: 1,
      name: 'PROPERTY_ID',
      isAsc: true,
      type: 'id',
    },
    {
      id: 2,
      name: 'PROPERTY_ID',
      type: 'id',
    },
    {
      id: 3,
      type: 'name',
      name: propertyName,
      isAsc: true,
    },
    {
      id: 4,
      type: 'name',
      name: propertyName,
    },
    {
      id: 5,
      type: 'type',
      name: 'PROPERTY_TYPE',
      isAsc: true,
    },
    {
      id: 6,
      type: 'type',
      name: 'PROPERTY_TYPE',
    },
    {
      id: 7,
      type: 'unitFloorBuilding',
      name: 'PROPERTY_UNIT_FLOOR_STREET_BUILDING',
      isAsc: true,
    },
    {
      id: 8,
      type: 'unitFloorBuilding',
      name: 'PROPERTY_UNIT_FLOOR_STREET_BUILDING',
    },
    {
      id: 9,
      type: 'notes',
      name: 'AD_COMMON_NOTES',
      isAsc: true,
    },
    {
      id: 10,
      type: 'notes',
      name: 'AD_COMMON_NOTES',
    },
    {
      id: 11,
      type: 'lastModifiedInfo',
      name: 'PROPERTY_LAST_MODIFIED',
      isAsc: true,
    },
    {
      id: 12,
      type: 'lastModifiedInfo',
      name: 'PROPERTY_LAST_MODIFIED',
    },
  ];
  const sortData = {
    sortIds: {
      title: 'COMMON_SORT_BY',
      options: listSorts,
    },
  };

  React.useEffect(() => {
    getList(1);
  }, [keyword, selectedFilter]);

  useEffect(() => {
    getInitData();
  }, []);

  const getInitData = async () => {
    getListData({ page: 1 });
  };

  const getList = (page = 1, text = keyword) => {
    const sortData = selectedFilter.sortIds ? selectedFilter.sortIds[0] : null;
    const params = {
      page,
      keyword: text,
    };
    if (sortData) {
      params.orderByColumn = InspectionPropertyOrderByColumn[sortData.type];
      params.isDescending = !sortData.isAsc;
    }
    getListData(params);
  };

  const onSearch = (text) => {
    setKeyword(text);
  };

  const onItemPress = (id) => {
    if (isSelect) {
      navigation.replace('selectForm', { selectedPropertyId: id });
      return;
    }
    navigation.navigate('propertyDetail', { id });
    getDetailProperty(id);
  };

  const onApplyFilter = (value) => {
    setSelectedFilter(value);
  };
  const listProps = {
    data,
    numColumns: 1,
    style: styles.list,
    isRefresh,
    isLoadMore,
    currentPage,
    totalPage,
    loadData: getListData,
    ItemSeparatorComponent: () => <View style={{ height: 20 }} />,
    renderItem: ({ item }) => <PropertyItem {...item} onItemPress={onItemPress} />,
    keyExtractor: (item) => `${item.id}`,
  };

  const mainLayoutProps = {
    style: styles.container,
    showBell: true,
    showLogo: true,
    addPermission: 'InspectionProperty.Create',
    onBtAddPress: () => {
      navigation.navigate('addProperty');
    },
    showAddButton: !isSelect,
    showBackButton: !isOfflineInspection,
    title: isSelect ? 'INSPECTION_SELECT_PROPERTY' : 'INSPECTION_TAB_PROPERTIES',
    ...getNonOfflineInspectionProps(isOfflineInspection),
  };

  if (isSelect) {
    mainLayoutProps.onBtAddPress = undefined;
  }

  return (
    <BaseLayout {...mainLayoutProps}>
      <Filter
        searchPlaceHolder="PROPERTY_SEARCH"
        sortData={sortData}
        onSearch={onSearch}
        showFilter={false}
        onSortCompleted={onApplyFilter}
        selectedSort={selectedFilter}
      />
      <LoaderContainer isLoading={isRefresh} loadingComponent={<ListPlaceholder />}>
        <AppList {...listProps} />
      </LoaderContainer>
      <NavigationEvents onWillFocus={doSynchronize} />
    </BaseLayout>
  );
};

export default PropertyScreen;
