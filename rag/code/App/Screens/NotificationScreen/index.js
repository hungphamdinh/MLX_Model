import React from 'react';
import { DeviceEventEmitter } from 'react-native';
import _ from 'lodash';
import AppList from '../../Components/Lists/AppList';
import BaseLayout from '../../Components/Layout/BaseLayout';
import { icons } from '../../Resources/icon';
import useNotification from '../../Context/Notification/Hooks/UseNotification';
import ItemNotification from '../../Components/ItemApp/ItemNotification';
import { PAGE_SIZE } from '../../Config';
import { mapNavigateToScreen } from '../../Services/PushNotificationService';

const Notification = () => {
  const {
    notification: { notifications },
    isLoading,
    getAllNotifications,
    updateRead,
  } = useNotification();

  React.useEffect(() => {
    getList(1);
  }, []);

  React.useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('UpdateListNotification', getList);
    return () => {
      subscription.remove();
    };
  }, []);

  const { data, isRefresh, isLoadMore, currentPage, totalPage } = notifications;

  const getList = (page) => {
    getAllNotifications({
      skipCount: (page - 1) * PAGE_SIZE,
      maxResultCount: PAGE_SIZE,
      page,
    });
  };

  const onItemPress = (item) => {
    const properties = _.get(item, 'notification.data.properties', {});
    const type = properties.Type;
    const parentId = properties.Id;
    updateRead(item.id);
    mapNavigateToScreen(type, parentId);
  };

  const renderItem = (item) => <ItemNotification item={item} onPress={() => onItemPress(item)} />;

  const listProps = {
    data,
    isRefresh,
    isLoadMore,
    currentPage,
    totalPage,
    iconName: icons.notificationEmpty,
    loadData: ({ page }) => getList(page),
    keyExtractor: (item) => item.id.toString(),
    renderItem: ({ item }) => renderItem(item),
  };

  return (
    <BaseLayout title="NOTIFICATION_TXT_TITLE" loading={isLoading}>
      <AppList {...listProps} />
    </BaseLayout>
  );
};

export default Notification;
