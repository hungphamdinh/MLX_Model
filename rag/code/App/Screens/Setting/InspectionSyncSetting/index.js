import React, { useState } from 'react';
import { Button, Card, Text } from '@Elements';
import styled from 'styled-components/native';
import _ from 'lodash';
import BaseLayout from '../../../Components/Layout/BaseLayout';
import { CheckBox } from '../../../Components/Forms/FormCheckBox';
import useInspection from '../../../Context/Inspection/Hooks/UseInspection';
import useSync from '../../../Context/Sync/Hooks/UseSync';
import { Colors } from '../../../Themes';
import useApp from '../../../Context/App/Hooks/UseApp';

const CardWrapper = styled(Card)`
  padding-horizontal: 18px;
  padding-vertical: 32px;
`;

const Title = styled(Text)`
  text-align: center;
  margin-top: 26px;
  margin-bottom: 13px;
`;

const SendDataWrapper = styled.View`
  margin-top: 10px;
  padding-horizontal: 18px;
  flex-direction: row;
  justify-content: flex-end;
`;

const SendDBTitle = styled(Text)`
  color: ${Colors.azure};
  text-align: right;
  margin-left: 20px;
`;

const InspectionSyncSetting = () => {
  const {
    inspection: { inspectionSetting },
    updateInspectionSetting,
  } = useInspection();

  const { sendLocalDBToServer } = useSync();
  const {
    app: { isDeveloperMode },
  } = useApp();

  const [allowCellular, setAllowCellular] = useState(_.get(inspectionSetting, 'isSynchronizationViaCellular', false));
  const data = [
    {
      title: 'ST_INSPECTION_SYNC_WIFI',
      value: false,
    },
    {
      title: 'ST_INSPECTION_SYNC_WIFI_CELLULAR',
      value: true,
    },
  ];
  const onConfirm = async () => {
    await updateInspectionSetting({ ...inspectionSetting, isSynchronizationViaCellular: allowCellular });
  };

  const onSyncMethodChange = (item) => {
    setAllowCellular(item.value);
  };

  const sendData = (isSendImage = false) => {
    sendLocalDBToServer(isSendImage);
  };

  return (
    <BaseLayout title="ST_INSPECTION_SYNC">
      <Title text="CHANGE_SYNC_TITLE" typo="H1" />
      <CardWrapper>
        {data.map((item) => (
          <CheckBox
            key={item.value}
            checkboxType="circle"
            value={item.value === allowCellular}
            label={item.title}
            labelStyle={{ flex: 1, fontSize: 14 }}
            onCheckBoxPress={() => onSyncMethodChange(item)}
          />
        ))}

        <Button title="COMMON_CONFIRM" primary rounded onPress={onConfirm} containerStyle={{ marginTop: 60 }} />
      </CardWrapper>
      {isDeveloperMode && (
        <SendDataWrapper>
          <Button primary outline onPress={sendData}>
            <SendDBTitle preset="medium" text="COMMON_SEND_DB" />
          </Button>
          <Button primary outline onPress={() => sendData(true)}>
            <SendDBTitle preset="medium" text="COMMON_SEND_IMAGE" />
          </Button>
        </SendDataWrapper>
      )}
    </BaseLayout>
  );
};

export default InspectionSyncSetting;
