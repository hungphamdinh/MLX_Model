import React from 'react';
import Row from '@Components/Grid/Row';
import { Text, IconButton } from '@Elements';
import styled from 'styled-components';

const RowWrapper = styled(Row)`
  margin-left: 10px;
  margin-bottom: 5px;
  justify-content: space-between;
`;
export default ItemUserEmail = ({ item, onPressRemove, testID }) => (
  <RowWrapper testID={testID} center>
    <Text text={item} />
    <IconButton onPress={onPressRemove} name="close-outline" />
  </RowWrapper>
);
