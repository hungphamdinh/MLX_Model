import React, { useEffect, useState } from 'react';
import { DeviceEventEmitter, Alert } from 'react-native';
import I18n from '@I18n';
import NavigationService from '@NavigationService';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import _ from 'lodash';
import AppList from '../../Components/Lists/AppList';
import BaseLayout from '../../Components/Layout/BaseLayout';
import { icons } from '../../Resources/icon';
import Filter from '../../Components/Filter';
import ItemDelivery from '../../Components/ItemApp/ItemDelivery';
import { convertDate } from '../../Utils';
import useDelivery from '../../Context/Delivery/Hooks/UseDelivery';
import { CheckBox, Text } from '../../Elements';
import { Colors } from '../../Themes';
import ParcelRemainModal from '../../Components/Delivery/ParcelRemainModal';
import { ParcelStatus } from '../../Config/Constants';
import { isGranted } from '../../Config/PermissionConfig';

const ActionWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  margin: 15px;
`;

const CheckOutWrapper = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

const CheckOutText = styled(Text)`
  margin-right: 5px;
  color: ${(props) => props.color};
`;
const Delivery = () => {
  const {
    delivery: { deliveries, listStatus, types },
    getAllDeliveries,
    detailDelivery,
    getDeliveryTypes,
    getDeliveryStatus,
    getParcelsInUnit,
  } = useDelivery();

  const [textSearch, setTextSearch] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [isShowCheckOutModal, setIsShowCheckOutModal] = useState([]);
  const [isSelectAll, setIsSelectAll] = useState(false);

  const defaultFilter = {
    dateRange: {
      fromDate: undefined,
      toDate: undefined,
    },
    statusIds: [ParcelStatus.WAITING_TO_RECEIVED],
  };

  const filterData = {
    dateRange: {
      title: 'COMMON_CREATED_DATE',
    },
    statusIds: {
      title: 'COMMON_STATUS',
      multiple: true,
      options: listStatus,
    },
    typeId: {
      title: 'AD_DL_TITLE_TYPE',
      multiple: true,
      options: types,
    },
  };

  const [selectedFilter, setSelectedFilter] = useState(defaultFilter);

  useEffect(() => {
    getDeliveryTypes();
    getDeliveryStatus();
  }, []);

  React.useEffect(() => {
    getList(1);
  }, [textSearch, selectedFilter]);

  React.useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('UpdateListDelivery', getList);
    return () => {
      subscription.remove();
    };
  }, []);

  const { data, isRefresh, isLoadMore, currentPage, totalPage } = deliveries;

  const getList = (page) => {
    const { fromDate, toDate } = selectedFilter.dateRange;

    getAllDeliveries({
      page,
      keyword: textSearch,
      statusIds: selectedFilter.statusIds,
      typeId: selectedFilter.typeId,
      fromDate: fromDate && convertDate.stringToISOString(fromDate),
      toDate: toDate && convertDate.stringToISOString(toDate),
    });
  };

  const onApplyFilter = (value) => {
    setSelectedFilter(value);
    setSelectedItems([]);
    setIsSelectAll(false);
  };

  const onTextSearchChange = (text) => {
    setTextSearch(text);
    // getList(1, text);
  };

  const gotoDetail = (deliveryId) => {
    detailDelivery({ deliveryId });
    NavigationService.navigate('editDelivery', {
      deliveryId,
    });
  };

  const onBtAddPress = () => {
    NavigationService.navigate('addDelivery');
  };

  const onReceiveCode = (result) => {
    NavigationService.navigate('checkOutDelivery', { guid: result });
  };

  const onScanQRPress = () => {
    NavigationService.navigate('scanQRCode', { callback: onReceiveCode });
  };

  const checkItem = (item) => {
    const isExist = selectedItems.find((parcel) => parcel.id === item.id);
    if (isExist) {
      const newSelectedItems = selectedItems.filter((parcel) => parcel.id !== item.id);
      setSelectedItems(newSelectedItems);
      return;
    }
    setSelectedItems([...selectedItems, item]);
    // setSelectedItems([item.id]);
    // setState({
    //   listDelivery: data.map((item) => ({
    //     ...item,
    //     checked: data.id === item.id ? !data.checked : item.checked,
    //   })),
    // });
  };

  const onCheckAll = (value) => {
    setIsSelectAll(value);
    setSelectedItems(value ? data : []);
  };

  // const checkAll = () => {
  //   const { checkedAll, listDelivery } = state;
  //   setState({
  //     checkedAll: !checkedAll,
  //     listDelivery: listDelivery.map((item) => ({
  //       ...item,
  //       checked: !checkedAll,
  //     })),
  //   });
  // };

  const showPickUpModal = async () => {
    const parcels = await getParcelsInUnit(selectedItems[0].unitId);
    const selectedIds = selectedItems.map((item) => item.id);
    const notSelectedParcels = parcels.filter((parcel) => !_.includes(selectedIds, parcel.id));

    if (notSelectedParcels.length > 0) {
      showPopUpToAskCheckOut(parcels, true);
    } else {
      changeVisibleCheckOutModal();
    }
    // checkParcelLeftsInUnit(checkList, true, checkList[0].unitId);
  };

  const showPopUpToAskCheckOut = (checkOutItems, showNoButton) => {
    const alertButton = [
      {
        text: I18n.t('AD_COMMON_CANCEL'),
        onPress: () => null,
      },
      {
        text: I18n.t('AD_COMMON_YES'),
        onPress: () => {
          setSelectedItems(checkOutItems);
          changeVisibleCheckOutModal();
        },
      },
    ];
    if (showNoButton) {
      alertButton.splice(1, 0, {
        text: I18n.t('AD_COMMON_NO'),
        onPress: () => changeVisibleCheckOutModal(),
      });
    }
    Alert.alert(
      I18n.t(''),
      `${I18n.t('DELIVERY_BATCH_PICK_UP_MODAL_CONTENT1')} ${checkOutItems.length - selectedItems.length} ${I18n.t(
        'DELIVERY_BATCH_PICK_UP_MODAL_CONTENT2'
      )}`,
      alertButton
    );
  };

  const onCloseParcelModal = () => {
    setIsShowCheckOutModal(false);
  };

  const changeVisibleCheckOutModal = () => {
    setIsShowCheckOutModal(true);
  };

  const onPressCheckOut = (params) => {
    onCloseParcelModal();
    setSelectedItems([]);
    NavigationService.navigate('signatureCheckOut', {
      params,
      screensAmount: 1,
    });
  };

  const renderItem = (item) => {
    const checked = selectedItems.findIndex((parcel) => parcel.id === item.id) > -1;
    return (
      <ItemDelivery
        checked={checked || isSelectAll}
        item={item}
        onPress={() => gotoDetail(item.id)}
        onCheck={() => checkItem(item)}
      />
    );
  };

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

  const isSameUnit = _.keys(_.groupBy(selectedItems, 'unitId')).length === 1;
  const isWaiting = selectedItems.filter((item) => item.statusId !== ParcelStatus.WAITING_TO_RECEIVED).length === 0;
  const allowCheckOut = selectedItems.length > 0 && isSameUnit && isWaiting;
  const checkOutTextColor = allowCheckOut ? Colors.text : Colors.disabled;
  return (
    <BaseLayout
      title="DL_TITLE_HEADER"
      onBtAddPress={onBtAddPress}
      showAddButton
      addPermission="Deliveries.Create"
      showBell
      rightBtn={{
        icon: icons.scanQR,
        size: 50,
        onPress: onScanQRPress,
      }}
    >
      <Filter
        data={filterData}
        onCompleted={onApplyFilter}
        selectedFilter={selectedFilter}
        defaultFilter={defaultFilter}
        onSearch={onTextSearchChange}
        searchPlaceHolder="DELIVERY_PLACEHOLDER_SEARCH"
      />
      {isGranted('Deliveries.Update') && (
        <ActionWrapper>
          <CheckBox
            title="DELIVERY_CHECK_ALL"
            containerStyle={{ flex: 1 }}
            checked={isSelectAll}
            onPressCheck={onCheckAll}
          />
          <CheckOutWrapper onPress={showPickUpModal} disabled={!allowCheckOut}>
            <CheckOutText preset="medium" text="DELIVERY_BATCH_PICK_UP" color={checkOutTextColor} />
            <Icon color={checkOutTextColor} name="logout" size={20} />
          </CheckOutWrapper>
        </ActionWrapper>
      )}

      <AppList {...listProps} />
      <ParcelRemainModal
        title="DELIVERY_BATCH_PICK_UP_MODAL_TITLE"
        list={selectedItems}
        visible={isShowCheckOutModal}
        onClosePress={onCloseParcelModal}
        onCheckOut={onPressCheckOut}
      />
    </BaseLayout>
  );
};

export default Delivery;
