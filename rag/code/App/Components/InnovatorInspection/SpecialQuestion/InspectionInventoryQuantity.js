import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components';
import { Text } from '../../../Elements';
import Row from '../../Grid/Row';
import { FormInput } from '../../Forms';

const Label = styled(Text)`
  margin-top: -5px;
`;

const Wrapper = styled(View)`
  flex: 1;
  margin-left: 10px;
`;


const InspectionInventoryQuantity = ({ inputProps, ...baseProps }) => (
  <View {...baseProps}>
    <Row center>
      <Label preset="bold" text="FORM_QUANTITY" />
      <Wrapper>
        <FormInput {...inputProps} mode="small" />
      </Wrapper>
    </Row>
  </View>
);

export default InspectionInventoryQuantity;
