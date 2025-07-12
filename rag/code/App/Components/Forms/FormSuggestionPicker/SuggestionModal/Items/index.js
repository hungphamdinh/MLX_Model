import _ from 'lodash';
import React from 'react';
import { Text } from '@Elements';
import styled from 'styled-components/native';

const RowWrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Symbol = styled.Image`
  width: 15px;
  height: 22px;
`;

const LeftValue = styled(Text)`
  font-size: 12px;
  margin-left: 12px;
  flex: 1;
`;

export const SuggestionRowItem = ({ icon, value, symbolStyle }) => {
  if (_.size(value) === 0) {
    return null;
  }

  return (
    <RowWrapper>
      {icon && <Symbol resizeMode="contain" source={icon} style={symbolStyle} />}
      <LeftValue text={value} preset="medium" />
    </RowWrapper>
  );
};
