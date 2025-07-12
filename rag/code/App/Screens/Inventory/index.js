import React, { useState } from 'react';
import { DeviceEventEmitter } from 'react-native';
import I18n from '@I18n';
import NavigationService from '@NavigationService';

import AppList from '../../Components/Lists/AppList';
import BaseLayout from '../../Components/Layout/BaseLayout';
import { icons } from '../../Resources/icon';
import useInventory from '../../Context/Inventory/Hooks/UseInventory';
import Filter, { FilterTypes } from '../../Components/Filter';
import ItemInventory from '../../Components/ItemApp/ItemInventory';
import { modal } from '../../Utils';
import useUser from '../../Context/User/Hooks/UseUser';

const Inventory = () => {
  const {
    inventory: { inventories, filterCategories, subCategories, warehouses },
    getAllInventories,
    getFilterCategories,
    getSubCategories,
    getLocations,
    detailInventory,
    getWareHouses,
  } = useInventory();

  const { getEmployees } = useUser();
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

  const listMinimumBalance = [
    {
      name: I18n.t('IV_EQUAL_UNDER_MIN_BALANCE'),
      id: true,
    },
  ];

  const defaultFilter = {
    isActive: [true],
    isMinimumBalance: [undefined],
  };

  const [selectedFilter, setSelectedFilter] = useState(defaultFilter);
  const [textSearch, setTextSearch] = useState('');

  const filterData = {
    categoryIds: {
      title: 'COMMON_CATEGORY',
      type: FilterTypes.DROPDOWN,
      options: filterCategories,
      onChange: (parentId) => {
        getSubCategories({
          parentId,
        });
        setSelectedFilter({
          ...selectedFilter,
          categoryIds: parentId,
        });
      },
    },
    subCategoryId: {
      title: 'COMMON_SUB_CATEGORY',
      dropdownProps: { disabled: !selectedFilter.categoryIds },
      type: FilterTypes.DROPDOWN,
      options: subCategories,
    },
    warehouseIds: {
      title: 'INVENTORY_WAREHOUSES',
      options: warehouses,
      listExist: warehouses.data,
      getList: (page, keyword) =>
        getWareHouses({
          page,
          keyword,
        }),
      type: FilterTypes.LIST_SELECT,
    },
    isActive: {
      title: 'COMMON_STATUS',
      multiple: false,
      options: listStatus,
    },
    isMinimumBalance: {
      options: listMinimumBalance,
      numOfColumns: 1,
    },
  };

  React.useEffect(() => {
    getList(1);
  }, [textSearch]);

  React.useEffect(() => {
    initData();
    const subscription = DeviceEventEmitter.addListener('ReloadInventory', () => getList(1));
    return () => {
      subscription.remove();
    };
  }, []);

  const { data, isRefresh, isLoadMore, currentPage, totalPage } = inventories;

  const initData = () => {
    getFilterCategories({
      page: 1,
      isParent: true,
      isParentNotChild: true,
      pageSize: 1000,
    });
    getLocations({
      page: 1,
    });
    getWareHouses();
    getEmployees();
  };

  const getList = (page, filter = selectedFilter) => {
    const filterParams = {
      ...filter,
      warehouseIds: filter.warehouseIds?.id,
      categoryIds: filter.subCategoryId || filter.categoryIds,
      isActive: filter.isActive[0],
      isMinimumBalance: filter.isMinimumBalance[0],
    };
    getAllInventories({
      page,
      keyword: textSearch,
      ...filterParams,
    });
  };

  const onReceiveCode = (result) => {
    const code = result.slice(-10);
    const index = result.search('IN');
    if (index > -1) {
      gotoDetail(code);
      return;
    }
    modal.showError(I18n.t('QRCODE_INCORRECT_CONTENT'));
  };

  const onScanQRPress = () => {
    NavigationService.navigate('scanQRCode', { callback: onReceiveCode });
  };

  const onTextSearchChange = (text) => {
    setTextSearch(text);
  };

  const gotoDetail = async (inventoryId) => {
    await detailInventory({ inventoryId });
    NavigationService.navigate('detailInventory', {
      inventoryId,
    });
  };

  const onAddInventory = () => {
    NavigationService.navigate('addInventoryItem');
  };

  const onApplyFilter = (value) => {
    setSelectedFilter(value);
    getList(1, value);
  };

  const onClearFilter = () => {
    setSelectedFilter(defaultFilter);
  };

  const renderItem = (item) => <ItemInventory item={item} onPress={() => gotoDetail(item.id)} />;

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

  return (
    <BaseLayout
      showAddButton
      title="AD_IV_TITLE_HEADER"
      showBell
      rightBtn={{
        icon: icons.scanQR,
        size: 50,
        onPress: onScanQRPress,
      }}
      onBtAddPress={onAddInventory}
    >
      <Filter
        data={filterData}
        onCompleted={onApplyFilter}
        selectedFilter={selectedFilter}
        defaultFilter={defaultFilter}
        onSearch={onTextSearchChange}
        showFilter
        searchPlaceHolder="AD_IS_TXT_PLACEHOLDER_SEARCH"
        onClear={onClearFilter}
      />
      <AppList {...listProps} />
    </BaseLayout>
  );
};

export default Inventory;
