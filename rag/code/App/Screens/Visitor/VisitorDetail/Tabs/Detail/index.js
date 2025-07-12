import React from 'react';
import styled from 'styled-components/native';
import { ItemVisitorDetail } from '@Components/ItemApp/ItemVisitor';
import useVisitor from '@Context/Visitor/Hooks/UseVisitor';
import I18n from '@I18n';
import NavigationService from '@NavigationService';
import { Button } from '@Elements';
import { Alert, View } from 'react-native';
import ReasonModal from '@Components/Visitor/ReasonModal';
import { toast } from '@Utils';
import { isGranted } from '@Config/PermissionConfig';
import { VISITOR_TRACKING_TYPE } from '@Config/Constants';
import _ from 'lodash';

const Wrapper = styled.ScrollView`
  flex: 1;
`;

const ActionWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const VisitorDetailTab = () => {
  const {
    visitor: { visitorDetail },
    trackingVisitor,
    deactivateVisitor,
  } = useVisitor();
  const [deactivateModalVisible, setDeactivateModalVisible] = React.useState(false);

  const btAskPress = (isCheckOut, callBack) => () => {
    Alert.alert(I18n.t(isCheckOut ? 'VISITOR_CHECKOUT' : 'VISITOR_CHECKIN'), I18n.t('COMMON_ASK_MESSAGE'), [
      {
        text: I18n.t('AD_COMMON_NO'),
        style: 'cancel',
      },
      {
        text: I18n.t('AD_COMMON_YES'),
        onPress: callBack,
      },
    ]);
  };

  const btCheckInPress = () => {
    onSubmit(false);
  };

  const btCheckOutPress = () => {
    onSubmit(true);
  };

  const btDeactivatePress = () => {
    setDeactivateModalVisible(true);
  };

  const onSubmit = async (isCheckOut) => {
    const params = {
      visitorId: visitorDetail.visitorId,
      visitorStatus: isCheckOut ? VISITOR_TRACKING_TYPE.CHECK_OUT : VISITOR_TRACKING_TYPE.CHECK_IN,
      value: new Date(),
    };

    const result = await trackingVisitor(params);
    if (result) {
      const message = isCheckOut ? 'VISITOR_CHECK_OUT_SUCCESS' : 'VISITOR_CHECK_IN_SUCCESS';
      toast.showSuccess(I18n.t(message));
      NavigationService.goBack();
    }
  };

  if (!visitorDetail) {
    return null;
  }

  const commonProps = {
    rounded: true,
    containerStyle: { marginTop: 20, marginRight: 20 },
  };

  const buttonProps = {
    ...commonProps,
    primary: true,
  };

  const deactivateProps = {
    ...commonProps,
    titleColor: 'white',
  };

  return (
    <Wrapper contentContainerStyle={{ paddingVertical: 12 }}>
      <ItemVisitorDetail item={visitorDetail} />
      {isGranted('Visitors.Update') && visitorDetail?.isActive && (
        <View>
          <ActionWrapper>
            <Button {...buttonProps} title="VISITOR_CHECKIN" onPress={btAskPress(false, btCheckInPress)} />
            <Button {...buttonProps} title="VISITOR_CHECKOUT" onPress={btAskPress(true, btCheckOutPress)} />
          </ActionWrapper>
          {isGranted('Visitors.Deactivate') && (
            <Button {...deactivateProps} title="COMMON_DEACTIVATE" onPress={btDeactivatePress} />
          )}
        </View>
      )}
      <ReasonModal
        submit={(reason) =>
          deactivateVisitor({
            ids: [visitorDetail.visitorId],
            reason,
          })
        }
        visible={deactivateModalVisible}
        onClosePress={() => setDeactivateModalVisible(false)}
      />
    </Wrapper>
  );
};

export default VisitorDetailTab;
