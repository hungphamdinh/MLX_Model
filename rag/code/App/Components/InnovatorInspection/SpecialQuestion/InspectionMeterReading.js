import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { Text } from '../../../Elements';
import Row from '../../Grid/Row';
import FormDate from '../../Forms/FormDate';
import { FormInput } from '../../Forms';

const Label = styled(Text)`
  margin-top: -5px;
  flex: 0.4;
`;

const Wrapper = styled(View)`
  flex: 0.7;
`;

const InspectionMeterReading = ({ dateProps, meterNoProps, registeredProps, ...baseProps }) => (
  <View {...baseProps}>
    <Row center>
      <Label preset="bold" text="FORM_METER_NO" />
      <Wrapper>
        <FormInput isNotFocusNextInput mode="small" {...meterNoProps} />
      </Wrapper>
    </Row>
    <Row center>
      <Label preset="bold" text="FORM_METER_TAKE_OVER_DATE" />
      <Wrapper>
        <FormDate small {...dateProps} />
      </Wrapper>
    </Row>
    <Row center>
      <Label preset="bold" text="FORM_METER_REGISTERED_NAME" />
      <Wrapper>
        <FormInput isNotFocusNextInput mode="small" {...registeredProps} />
      </Wrapper>
    </Row>
  </View>
);

export default InspectionMeterReading;
