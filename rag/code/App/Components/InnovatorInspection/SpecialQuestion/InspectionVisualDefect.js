import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { Text } from '../../../Elements';
import Row from '../../Grid/Row';
import { FormInput } from '../../Forms';

const Label = styled(Text)`
  margin-top: -5px;
  flex: 0.4;
`;

const Wrapper = styled(View)`
  flex: 0.7;
`;


const InspectionVisualDefect = ({ inputProps, ...baseProps }) => (
  <View {...baseProps}>
    <Row center>
      <Label preset="bold" text="FORM_VISUAL_DEFECT_NAME" />
      <Wrapper>
        <FormInput placeholder="COMMON_PLACE_HOLDER_INPUT_TEXT" {...inputProps} mode="small" />
      </Wrapper>
    </Row>
  </View>
);

export default InspectionVisualDefect;
