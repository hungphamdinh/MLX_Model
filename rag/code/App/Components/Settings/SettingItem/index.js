import React from 'react';
import styled from 'styled-components/native';
import { Text } from '@Elements';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '../../../Themes';

const Wrapper = styled.TouchableOpacity`
  background-color: ${(props) => props.backgroundColor};
  height: 54px;
  border-radius: 27px;
  padding-horizontal: 27px;
  margin-horizontal: 15px;
  margin-bottom: 10px;
  flex-direction: row;
  align-items: center;
  box-shadow: 0px 3px 6px #00000029;
  elevation: 3;
`;

const NextWrapper = styled.View`
  width: 18px;
  height: 18px;
  background-color: #648fca;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
`;

const Title = styled(Text)`
  font-size: 12px;
  flex: 1;
  text-transform: capitalize;
`;

const LeftIcon = styled.Image`
  width: 18px;
  height: 18px;
  margin-right: 23px;
  tint-color: black;
`;

const ItemSetting = ({ title, icon, onPress, logout }) => {
  const backgroundColor = logout ? Colors.primary : 'white';
  return (
    <Wrapper onPress={onPress} backgroundColor={backgroundColor}>
      <LeftIcon source={icon} resizeMode="contain" />
      <Title text={title} preset="bold" />
      {!logout && (
        <NextWrapper>
          <Icon size={12} color="white" name="chevron-forward" />
        </NextWrapper>
      )}
    </Wrapper>
  );
};

export default ItemSetting;
