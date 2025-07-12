import React from 'react';
import styled from 'styled-components/native';
import { Text } from '@Elements';
import { Colors } from '../../../Themes';
import ShadowView from '../../../Elements/ShadowView';

const LabelValueWrapper = styled.View`
  flex: 1;
`;

const Label = styled(Text)`
  color: #757575;
`;

const Value = styled(Text)`
  color: #001335;
  margin-top: 5px;
`;

export const VerticalLabelValue = ({ label, value, style }) => (
  <LabelValueWrapper style={style}>
    <Label text={label} preset="medium" />
    <Value text={value} preset="medium" />
  </LabelValueWrapper>
);

export const Wrapper = styled(ShadowView).attrs((props) => ({
  disabled: !props.onPress,
}))`
  background-color: white;
  border-radius: 14px;
  margin-bottom: 10px;
  padding: 14px;
  margin-horizontal: 15px;
`;

export const ID = styled(Text)``;

export const RowWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 20px;
`;

export const HorizontalLine = styled.View`
  height: 1px;
  width: 100%;
  background-color: ${Colors.border};
  margin-bottom: 12px;
`;
