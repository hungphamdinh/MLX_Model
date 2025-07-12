import React from 'react';
import { Text } from '@Elements';
import styled from 'styled-components/native';
import { Colors } from '../../../Themes';
import { icons } from '../../../Resources/icon';

const Wrapper = styled.View`
  flex: 1;
  align-items: flex-start;
`;

const Button = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: ${Colors.azure};
  border-radius: 18px;
  padding-horizontal: 10px;
  height: 36px;
`;

const Title = styled(Text)`
  color: white;
  font-size: 12px;
  margin-right: 12px;
`;

const Circle = styled.View`
  width: 15px;
  height: 15px;
  border-radius: 7px;
  background-color: white;
  justify-content: center;
  align-items: center;
`;

const RightArrow = styled.Image`
  width: 8px;
  height: 8px;
`;

const AddAttendanceButton = (props) => (
  <Wrapper>
    <Button {...props}>
      <Title preset="medium" text="AD_CHEHCKIN_TITLE_HEADER" />
      <Circle>
        <RightArrow source={icons.doubleArrow} resizeMode="contain" />
      </Circle>
    </Button>
  </Wrapper>
);

export default AddAttendanceButton;
