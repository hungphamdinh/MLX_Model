import React, { useEffect } from 'react';
import { DeviceEventEmitter } from 'react-native';
import I18n from '@I18n';
import NavigationServices from '@NavigationService';
import BaseLayout from '../../../Components/Layout/BaseLayout';
import VisitorDetailTab from './Tabs/Detail';
import TabView from '../../../Components/TabView';
import InventoryPassTab from './Tabs/Pass';
import useVisitor from '../../../Context/Visitor/Hooks/UseVisitor';
import { icons } from '../../../Resources/icon';
import { isGranted } from '../../../Config/PermissionConfig';

const VisitorDetail = ({ navigation }) => {
  const {
    visitor: { visitorDetail },
    detailVisitor,
  } = useVisitor();

  const id = navigation.getParam('id');

  const getVisitorDetail = () => {
    if (id) {
      detailVisitor({ visitorId: id });
    }
  };

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('UpdateListVisitor', getVisitorDetail);
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    getVisitorDetail();
  }, []);

  const onEditVisitorPress = () => {
    NavigationServices.navigate('editVisitor', { id });
  };

  const baseLayoutProps = {
    title: 'VISITOR_MANAGEMENT_TITLE',
    showBell: false,
    rightBtn: isGranted('Visitors.Update') && {
      icon: icons.edit,
      onPress: onEditVisitorPress,
    },
  };

  if (!visitorDetail) {
    return <BaseLayout {...baseLayoutProps} displayPlaceholder />;
  }

  return (
    <BaseLayout {...baseLayoutProps}>
      {!visitorDetail?.isActive ? (
        <VisitorDetailTab tabLabel={I18n.t('VISITOR_DETAIL')} />
      ) : (
        <TabView>
          <VisitorDetailTab tabLabel={I18n.t('VISITOR_DETAIL')} />
          <InventoryPassTab tabLabel={I18n.t('VISITOR_PASS')} />
        </TabView>
      )}
    </BaseLayout>
  );
};

export default VisitorDetail;
