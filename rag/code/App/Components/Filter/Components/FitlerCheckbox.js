import React from 'react';
import { Text } from 'react-native';
import _ from 'lodash';
import styled from 'styled-components/native';
import { CheckBox } from '../../Forms/FormCheckBox';
import { IconButton } from '../../../Elements';
import I18n from '../../../I18n';

const ColorBox = styled.View`
  background-color: ${(props) => props.color};
  width: 15px;
  height: 15px;
  border-radius: 4px;
  box-shadow: 0px 3px 6px #00000029;
  elevation: 6;
  margin-left: 13px;
`;

const CheckBoxWrapper = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  width: ${({ numOfColumns }) => 100 / numOfColumns}%;
  margin-bottom: 14px;
`;

const FilterCheckBox = ({
  onPress,
  name,
  isCheck,
  colorCode,
  numOfColumns,
  isRadioBtn,
  isSort = false,
  isAsc = false,
}) => (
  <CheckBoxWrapper onPress={onPress} numOfColumns={numOfColumns}>
    <CheckBox
      isRadioBtn={isRadioBtn}
      value={isCheck}
      onCheckBoxPress={onPress}
      containerStyle={{ marginBottom: 0, marginRight: 5 }}
    />
    {_.size(colorCode) > 0 && <ColorBox color={colorCode} />}
    <Text style={{ marginLeft: 8, flex: isSort ? null : 1 }}>{I18n.t(name)}</Text>
    {isSort && <IconButton disabled size={20} name={isAsc ? 'arrow-up' : 'arrow-down'} />}
  </CheckBoxWrapper>
);

export default FilterCheckBox;
