import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import I18n from '@I18n';
import moment from 'moment';
import Row from '../../../Components/Grid/Row';
import { Colors, Fonts, Metric } from '../../../Themes';
import { Button, Text } from '../../../Elements';
import ItemWrapper from './ItemWrapper';
import AppList from '../../Lists/AppList';
import { CheckBox } from '../../Forms/FormCheckBox';
import { withModal } from '../../../HOC';

const ParcelRemainModal = ({ onCheckOut, list = [], listParcels = { data: [] }, currentParcel, values }) => {
  const [parcels, setParcel] = useState(list);

  const [checkedAll, setCheckedAll] = useState(false);

  const isCheck = parcels.filter((item) => item.checked).length > 0;
  // const {data, currentPage, totalPage, isLoadMore} = list;

  const checkOut = async () => {
    const params = [];

    if (currentParcel) {
      parcels.map((item) => {
        if (item.checked || item.id === currentParcel.id) {
          params.push({
            unitId: item.unitId,
            deliveryId: item.id,
            // deliveryText: item.deliveryText,
            // deliveryReceiveSignedId: currentParcel.receiveSignedId,
            residentUserId: values.parcel.residentId
              ? validateId(values.member.residentId || values.member.id)
              : undefined,
            deliveryUserId: values.parcel.deliveryUserId
              ? validateId(values.member.deliveryUserId || values.member.id)
              : undefined,
            residentName: values.displayName,
            residentPhone: values.member.phoneNumber,
            receivedDate: moment(values.toDate).format(),
            residentEmail: values.member.emailAddress,
            residentNote: values.note,
          });
        }
      });
      onCheckOut(params);
    } else {
      parcels.map((item) => {
        if (item.checked) {
          params.push({
            unitId: item.unitId,
            deliveryId: item.id,
            residentUserId: parcels[0].residentId,
            residentName: parcels[0].residentUser.displayName,
            residentPhone: parcels[0].residentUser.phoneNumber,
            receivedDate: moment(new Date()).format(),
            residentEmail: parcels[0].residentUser.emailAddress,
          });
        }
      });
      onCheckOut(params);
    }
  };

  const validateId = (id) => (id === 0 ? undefined : id);

  useEffect(() => {
    if (list.length > 0) {
      setParcel(
        list.map((item) => ({
          ...item,
          checked: true,
        }))
      );
    }
  }, [list]);

  useEffect(() => {
    setCheckedAll(parcels.filter((item) => item.checked).length === parcels.length);
  }, [parcels.filter((item) => item.checked).length]);

  const onCheckBoxPress = (value) => {
    setParcel(parcels.map((item) => ({ ...item, checked: value.id === item.id ? !value.checked : item.checked })));
  };

  const listProps = listParcels.data &&
    currentParcel && {
      data: parcels,
      numColumns: 1,
      keyword: '',
      style: { maxHeight: Metric.ScreenHeight / 2 },
      contentContainerStyle: { paddingBottom: 0 },
      showsVerticalScrollIndicator: false,
      isRefresh: listParcels.isRefresh,
      isLoadMore: listParcels.isLoadMore,
      currentPage: listParcels.currentPage,
      totalPage: listParcels.totalPage,
      loadData: () => {},

      renderItem: ({ item, index }) => (
        <ItemWrapper key={index.toString()} item={item} onCheckBoxPress={onCheckBoxPress} />
      ),
      keyExtractor: (item) => `${item.id}`,
    };

  const onCheckAll = () => {
    setCheckedAll(!checkedAll);
    setParcel(
      parcels.map((item) => ({
        ...item,
        checked: !checkedAll,
      }))
    );
  };

  return (
    <View>
      <View style={styles.checkBoxAll}>
        <CheckBox value={checkedAll} onCheckBoxPress={onCheckAll} />
        <Text style={{ marginLeft: 10 }} fontFamily={Fonts.Bold} text={I18n.t('DELIVERY_CHECK_ALL')} />
      </View>
      <View style={styles.contentContainer}>
        {currentParcel ? (
          <AppList {...listProps} />
        ) : (
          <>
            {parcels.map((item, index) => (
              <ItemWrapper key={index.toString()} item={item} onCheckBoxPress={onCheckBoxPress} />
            ))}
          </>
        )}

        <Row style={styles.actionContainer}>
          <Button
            light={!isCheck}
            disabled={!isCheck}
            block
            primary
            rounded
            title={I18n.t('DELIVERY_CHECK_OUT')}
            onPress={checkOut}
          />
        </Row>
      </View>
    </View>
  );
};

export default withModal(ParcelRemainModal, 'DELIVERY_BATCH_PICK_UP_MODAL_TITLE');

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 10,
  },
  closeImage: {
    width: 15,
    height: 15,
  },
  button: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    alignSelf: 'flex-end',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    borderBottomColor: Colors.gray,
    marginBottom: 20,
  },
  actionContainer: {
    justifyContent: 'space-around',
  },
  buttonCancel: {
    marginRight: 10,
  },
  checkBoxAll: {
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
});
