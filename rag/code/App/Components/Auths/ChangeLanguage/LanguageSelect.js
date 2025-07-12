import React from 'react';
import { Image } from 'react-native';
import styled from 'styled-components/native';
import I18n from '@I18n';
import DownIcon from 'react-native-vector-icons/Ionicons';
import { Dropdown } from '../../../Elements';
import { Colors } from '../../../Themes';
import { icons } from '../../../Resources/icon';

const DownWrapper = styled.View`
  margin-top: 10px;
  align-items: center;
`;

const Wrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  border-radius: 25px;
  padding-left: 15px;
  border-color: ${Colors.border};
  margin-bottom: 10px;
`;

const LanguageSelect = ({ selectedItem, currentLang, ...restProps }) => (
  <Dropdown
    {...restProps}
    showSearchBar
    fieldName="title"
    options={I18n.languages}
    icon={icons.property}
    value={selectedItem}
    showCheckAll={false}
    renderCustomButtonView={() => (
      <DownWrapper>
        <Wrapper>
          <Image style={{ width: 30, height: 22, marginRight: 10 }} source={{ uri: currentLang.icon }} />
          <DownIcon name="caret-down-outline" size={18} />
        </Wrapper>
      </DownWrapper>
    )}
  />
);

export default LanguageSelect;
