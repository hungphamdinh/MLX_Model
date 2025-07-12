import React from 'react';
import styled from 'styled-components/native';
import { Text } from '@Elements';
import { Colors } from '../../../Themes';

const CircleCheckBoxWrapper = styled.View`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  border-width: 1px;
  border-color: #707070;
  align-items: center;
  justify-content: center;
`;

const Circle = styled.View`
  background-color: ${Colors.yellow};
  width: 18px;
  height: 18px;
  border-radius: 9px;
`;

const CircleCheckBox = ({ isSelected }) => <CircleCheckBoxWrapper>{isSelected && <Circle />}</CircleCheckBoxWrapper>;

const Wrapper = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding-horizontal: 33px;
  height: 80px;
  border-color: #b89e9e;
  border-bottom-width: 1px;
  border-top-width: ${(props) => (props.borderTop ? 1 : 0)};
`;

const Title = styled(Text)`
  flex: 1;
  color: black;
`;

const LanguageItem = ({ onPress, title, isSelected, borderTop }) => (
  <Wrapper onPress={onPress} borderTop={borderTop}>
    <Title text={title} />
    <CircleCheckBox isSelected={isSelected} />
  </Wrapper>
);

export default LanguageItem;
