import { View } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { Text } from '@Elements';
import I18n from '@I18n';
import AppList from '../../../Lists/AppList';

const EmptySync = ({ title }) => (
  <View style={styles.emptyContainer}>
    <Icon name="ios-cloud-done" size={80} />
    <Text style={styles.updated}>{title}</Text>
  </View>
);

const SyncList = ({ list, ...props }) => {
  const listProps = {
    data: list.data,
    numColumns: 1,
    style: styles.list,
    showsVerticalScrollIndicator: false,
    isRefresh: list.isRefresh,
    isLoadMore: list.isLoadMore,
    currentPage: list.currentPage,
    totalPage: list.totalPage,
    emptyComponent: <EmptySync title={I18n.t('INSPECTION_SYNC_UP_TO_DATE')} />,
    keyExtractor: (item) => `${item.id}`,
    ...props,
  };
  return <AppList {...listProps} />;
};

export default SyncList;

const styles = {
  separator: {
    height: 20,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
};
