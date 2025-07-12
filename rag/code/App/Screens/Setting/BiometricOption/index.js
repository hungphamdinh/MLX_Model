import React from 'react';
import { Switch } from 'react-native';
import styled from 'styled-components';
import Row from '@Components/Grid/Row';
import { Text } from '@Elements';

const Wrapper = styled(Row)`
  justify-content: space-between;
  padding-horizontal: 20px;
  margin-vertical: 10px;
`;

const BiometricOption = ({ isBiometric, changeSwitchValue }) => (
  <Wrapper>
    <Text preset="bold" text="PROFILE_BIOMETRIC_SETTING" />
    <Switch
      value={isBiometric}
      onValueChange={(val) => {
        changeSwitchValue(val);
      }}
    />
  </Wrapper>
);

export default BiometricOption;
