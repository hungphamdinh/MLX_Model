import React from 'react';
import styled from 'styled-components/native';
import { Text } from '@Elements';
import I18n from '@I18n';

const Wrapper = styled.View`
  margin-bottom: 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Label = styled(Text)`
  flex: 1;
`;

const Value = styled(Text)``;

const LabelValue = ({ label, value, suffixComponent }) => (
  <>
    {value ? (
      <Wrapper>
        <Label preset="medium">{I18n.t(label)}:</Label>
        <Value>{value}</Value>
        {suffixComponent}
      </Wrapper>
    ) : null}
  </>
);

export default LabelValue;
