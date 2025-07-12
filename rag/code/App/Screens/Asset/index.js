import React, { useState, useEffect } from 'react';
import { DeviceEventEmitter } from 'react-native';
import _ from 'lodash';
import ItemAsset from '@Components/ItemApp/ItemAsset';
import useAsset from '@Context/Asset/Hooks/UseAsset';
import NavigationService from '@NavigationService';
import Filter, { FilterTypes } from '@Components/Filter';
import useFeedback from '@Context/Feedback/Hooks/useFeedback';
import AppList from '../../Components/Lists/AppList';
import BaseLayout from '../../Components/Layout/BaseLayout';
import { convertDate } from '../../Utils';
import { icons } from '../../Resources/icon';
import useWorkflow from '../../Context/Workflow/Hooks/UseWorkflow';
import { Modules } from '../../Config/Constants';

const multipleOptionValue = {
  isInactive: 'isInactive',
  isActive: 'isActive',
};

const Asset = () => {
  const { asset, getAssets, getAssetTypesFilter, getCompanies, getAssetByCode } = useAsset();
  const {
    getWorkflowStatus,
    workflow: { statusList },
  } = useWorkflow();

  const {
    feedback: { qrFeedbackSetting },
    getQrFeedbackSetting,
  } = useFeedback();

  const { list, companies } = asset;
  const assetTypes = asset.assetTypesFilter;

  const { data, isRefresh, isLoadMore, currentPage, totalPage } = list;

  const defaultFilter = {
    datePurchased: {
      fromDate: undefined,
      toDate: undefined,
    },
    dateWarranty: {
      fromDate: undefined,
      toDate: undefined,
    },
    assetTypeIds: undefined,
    companyId: undefined,
    multipleOptions: [multipleOptionValue.isActive],
  };

  const filterData = {
    datePurchased: {
      title: 'PURCHASED_DATE',
      type: FilterTypes.DATE_TIME,
    },
    dateWarranty: {
      title: 'WARRANTY_DATE',
      type: FilterTypes.DATE_TIME,
    },
    assetTypesFilter: {
      title: 'ASSET_TYPE',
      options: assetTypes,
      listExist: assetTypes.data,
      getList: (page, keyword) => getAssetTypesFilter({ page, keyword }),
      type: FilterTypes.LIST_SELECT,
    },
    companiesFilter: {
      title: 'COMPANY',
      options: companies,
      listExist: companies.data,
      getList: (page, keyword) => getCompanies({ page, keyword }),
      type: FilterTypes.LIST_SELECT,
    },
    locationName: {
      title: 'UNIT_LOCATION',
    },
    multipleOptions: {
      valKey: 'value',
      options: [
        {
          value: multipleOptionValue.isActive,
          name: 'COMMON_ACTIVE',
        },
        {
          value: multipleOptionValue.isInactive,
          name: 'COMMON_INACTIVE',
        },
      ],
    },
  };

  const [selectedFilter, setSelectedFilter] = useState(defaultFilter);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    getQrFeedbackSetting();
  }, []);

  React.useEffect(() => {
    getAssetTypesFilter();
    getCompanies();
    if (!_.size(statusList)) {
      getWorkflowStatus(Modules.INSPECTION);
    }
    const subscription = DeviceEventEmitter.addListener('ReloadAsset', getList);
    return () => {
      subscription.remove();
    };
  }, []);

  React.useEffect(() => {
    getList();
  }, [selectedFilter, keyword]);

  const getList = (page = 1, filter = selectedFilter) => {
    const { datePurchased, dateWarranty, assetTypesFilter, companiesFilter, multipleOptions, locationName } = filter;
    const filterParams = {
      assetTypeIds: assetTypesFilter?.id,
      companyIds: companiesFilter?.id,
      isActive: multipleOptions.includes(multipleOptionValue.isActive),
      fromPurchasedDate: convertDate.stringToISOString(datePurchased.fromDate),
      toPurchasedDate: convertDate.stringToISOString(datePurchased.toDate),
      fromWarrantDate: convertDate.stringToISOString(dateWarranty.fromDate),
      toWarrantDate: convertDate.stringToISOString(dateWarranty.toDate),
      locationName,
      sorting: 'id desc',
    };

    getAssets({
      page,
      keyword,
      ...filterParams,
    });
  };

  const onApplyFilter = (value) => {
    setSelectedFilter(value);
  };

  const onPressItem = (id) => {
    NavigationService.navigate('detailAssets', { id });
  };

  const renderItem = (item) => <ItemAsset item={item} onPress={() => onPressItem(item.id)} />;

  const onAddAsset = () => {
    NavigationService.navigate('addAsset');
  };

  const listProps = {
    data,
    isRefresh,
    isLoadMore,
    currentPage,
    totalPage,
    loadData: ({ page }) => getList(page),
    keyExtractor: (item) => item.id.toString(),
    renderItem: ({ item }) => renderItem(item),
    contentContainerStyle: {
      marginTop: 20,
    },
  };

  React.useEffect(() => {
    getList(1);
  }, []);

  const openQRCodeScanner = () => {
    NavigationService.navigate('scanQRCode', {
      isScanDynamicLink: true,
      notAllowGoBack: true,
      callback: (assetCode) => {
        getAssetByCode({
          code: assetCode,
        });
      },
    });
  };

  const rightButtonProps = {
    icon: icons.scanQR,
    size: 50,
    onPress: () => openQRCodeScanner(),
  };

  const layoutProps = {
    addPermission: 'Asset.Create',
    showAddButton: !qrFeedbackSetting?.isEmbedExternalWebsite,
    onBtAddPress: onAddAsset,
    rightBtn: rightButtonProps,
    showBell: true,
  };

  return (
    <BaseLayout {...layoutProps} title="ASSET_TXT">
      <Filter
        data={filterData}
        onCompleted={onApplyFilter}
        selectedFilter={selectedFilter}
        defaultFilter={defaultFilter}
        searchPlaceHolder="ASSET_SEARCH_PLACEHOLDER"
        onSearch={(key) => setKeyword(key)}
      />
      <AppList {...listProps} />
    </BaseLayout>
  );
};

export default Asset;
