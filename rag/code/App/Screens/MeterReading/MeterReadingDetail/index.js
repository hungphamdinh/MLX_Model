import React from 'react';
import I18n from '@I18n';
import BaseLayout from '../../../Components/Layout/BaseLayout';
import TabView from '../../../Components/TabView';
import MeterReadingHistoryTab from './Tabs/History';
import DeviceRelationshipView from './Tabs/DeviceRelationship';

const MeterReadingDetail = ({ navigation }) => {
  const id = navigation.getParam('id');
  const meterDeviceId = navigation.getParam('meterDeviceId');
  // const {
  //   getMeterReadingHistories,
  // } = useMeterReading();
  //
  // useEffect(() => {
  //   getMeterReadingHistories(id);
  // }, []);

  const mainLayoutProps = {
    noPadding: true,
    title: I18n.t('METER_READING_HISTORY'),
  };

  return (
    <BaseLayout {...mainLayoutProps}>
      <TabView>
        <DeviceRelationshipView tabLabel={I18n.t('METER_DEVICE_RELATIONSHIP')} meterDeviceId={meterDeviceId} />
        <MeterReadingHistoryTab tabLabel={I18n.t('METER_READING_HISTORY')} id={id} />
      </TabView>
    </BaseLayout>
  );
};

export default MeterReadingDetail;
