import React, { useEffect } from 'react';
import styled from 'styled-components/native';
import { Button, Card, Text } from '@Elements';
import { FormProvider, useFieldArray } from 'react-hook-form';
import { icons } from '../../../Resources/icon';
import AwareScrollView from '../../../Components/Layout/AwareScrollView';
import BaseLayout from '../../../Components/Layout/BaseLayout';
import SettingNotificationItem from '../../../Components/Settings/SettingNotificationItem';
import useNotification from '../../../Context/Notification/Hooks/UseNotification';
import { getIconByModuleId } from '../../../Config/Constants';
import { useCompatibleForm } from '../../../Utils/hook';

const CardWrapper = styled(Card)`
  padding: 0px;
`;

const HeaderWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  margin-horizontal: 16px;
  margin-vertical: 10px;
`;

const Title = styled(Text)`
  flex: 1;
  text-transform: capitalize;
`;

const Icon = styled.Image`
  margin-horizontal: 20px;
`;

const SaveButton = styled(Button).attrs(() => ({
  containerStyle: {
    marginTop: 50,
    marginBottom: 20,
  },
}))``;

const SettingNotification = () => {
  const {
    notification: { notificationSetting },
    getNotificationSetting,
    updateNotificationSetting,
  } = useNotification();

  const formMethods = useCompatibleForm({
    defaultValues: {
      receiveNotifications: true,
      settings: notificationSetting?.settings,
    },
  });

  const settingFieldArray = useFieldArray({
    control: formMethods.control,
    name: 'settings',
    keyName: 'uniqueId',
  });

  useEffect(() => {
    getNotificationSetting();
  }, []);

  useEffect(() => {
    if (notificationSetting) {
      formMethods.reset({ settings: notificationSetting.settings });
    }
  }, [notificationSetting]);

  const onUpdateNotificationSettings = (values) => {
    updateNotificationSetting(values);
  };

  if (!notificationSetting) {
    return <BaseLayout title="PROFILE_BTN_SETTING" />;
  }

  return (
    <BaseLayout title="PROFILE_BTN_SETTING">
      <HeaderWrapper>
        <Title typo="H1" text="ST_DETAIL_NOTI" preset="bold" />
        <Icon source={icons.notifySetting} />
        <Icon source={icons.mailSetting} />
      </HeaderWrapper>
      <FormProvider {...formMethods}>
        <AwareScrollView>
          <CardWrapper>
            {settingFieldArray.fields.map((item, index) => (
              <SettingNotificationItem
                key={item.displayName}
                displayName={item.displayName}
                icon={getIconByModuleId(item.moduleId)}
                name={`settings.${index}`}
              />
            ))}
            <SaveButton
              title="AD_COMMON_SAVE"
              primary
              rounded
              onPress={formMethods.handleSubmit(onUpdateNotificationSettings)}
            />
          </CardWrapper>
        </AwareScrollView>
      </FormProvider>
    </BaseLayout>
  );
};

export default SettingNotification;
