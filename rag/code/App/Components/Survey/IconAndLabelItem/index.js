import React from 'react';
import styled from 'styled-components/native';
import { Text } from '@Elements';
import IonIcon from 'react-native-vector-icons/Ionicons';

const InfoWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${(props) => (props.noMargin ? 0 : 16)}px;
`;

const Label = styled(Text)`
  margin-left: 5px;
`;

const IconAndLabelItem = ({ iconName, label, noMargin, style }) => (
  <InfoWrapper noMargin={noMargin} style={style}>
    <IonIcon color="#001335" size={20} name={iconName} />
    <Label>{label}</Label>
  </InfoWrapper>
);

export default IconAndLabelItem;
