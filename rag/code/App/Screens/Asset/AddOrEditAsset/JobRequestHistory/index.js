import React, { useEffect } from 'react';
import { View } from 'react-native';
import _ from 'lodash';
import NavigationService from '@NavigationService';
import ItemJR from '@Components/ItemApp/ItemJR';
import useJobRequest from '@Context/JobRequest/Hooks/UseJobRequest';
import { PAGE_SIZE } from '@Config';
import AppList from '@Components/Lists/AppList';
import useAsset from '@Context/Asset/Hooks/UseAsset';
import { JR_STATUS_ID } from '@Config/Constants';
import { icons } from '../../../../Resources/icon';

const JobRequestHistory = () => {
  const {
    jobRequest: { jrHistorylist, statusList },
    getAssetJrHistory,
    getGroupCategories,
  } = useJobRequest();

  const {
    asset: { assetDetail },
  } = useAsset();

  const { data, isRefresh, isLoadMore, currentPage, totalPage } = jrHistorylist;

  useEffect(() => {
    getJrHistory(1);
    if (!_.size(statusList)) {
      getGroupCategories();
    }
  }, []);

  const getJrHistory = (page = 1, keyword = '') => {
    const getData = getAssetJrHistory;
    let filterParams = {};
    filterParams = {
      statusIds: [JR_STATUS_ID.COMPLETED, JR_STATUS_ID.RESOLVED],
      assetIds: assetDetail.id,
    };

    getData({
      page,
      pageSize: PAGE_SIZE,
      keyword,
      ...filterParams,
    });
  };

  const renderItem = (item, index) => (
    <ItemJR
      item={item}
      onPress={() => gotoDetail(item)}
      isShowSignBtn={false}
      isShowIRLinkage={false}
      testID={`item-jr-${index + 1}`}
    />
  );

  const gotoDetail = (item) => {
    if (!item.isActive) {
      return;
    }
    NavigationService.navigate('editJobRequest', {
      id: item.id,
    });
  };

  const listProps = {
    data,
    isRefresh,
    isLoadMore,
    currentPage,
    totalPage,
    iconName: icons.jobRequestEmpty,
    loadData: ({ page }) => getJrHistory(page),
    keyExtractor: (item) => item.id.toString(),
    renderItem: ({ item, index }) => renderItem(item, index),
  };

  return (
    <View style={{ flex: 1 }}>
      <AppList {...listProps} />
    </View>
  );
};

export default JobRequestHistory;
