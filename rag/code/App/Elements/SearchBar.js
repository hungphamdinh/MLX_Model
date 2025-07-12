/* @flow */

import React, { PureComponent } from 'react';
import I18n from '@I18n';
import styled from 'styled-components/native';
import _ from 'lodash';
import { Platform } from 'react-native';
import Text from './Text';

import { icons } from '../Resources/icon';

type Props = {
  style?: Object,
  placeholder: string,
};

type State = {
  text: string,
};

const InputTopSection = styled.View`
  flex-direction: row;
  align-items: center;
  height: 46px;
  border-radius: 23px;
  background-color: white;
  box-shadow: 0px 3px 6px #00000029;
  elevation: 6;
  margin: 15px;
`;

const SearchTopSection = styled.View`
  width: 46px;
  height: 46px;
  border-radius: 23px;
  background-color: #f5f5f5;
  align-items: center;
  justify-content: center; ;
`;

const SearchInput = styled.TextInput`
  flex: 1;
  margin-left: 23px;
  font-family: Gotham-Book;
`;

const PlaceholderWrapper = styled.View`
  position: absolute;
  left: 25px;
  right: 50px;
  top: 0px;
  bottom: 0px;
  justify-content: center;
`;

const PlaceholderText = styled(Text)`
  color: #9f9f9f;
`;

const SearchIcon = styled.Image``;

export default class SearchBar extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      text: props.value,
    };
    this.timer = null;
  }

  setText = (text) => {
    this.setState({
      text,
    });
  };

  onChangeText = (text) => {
    this.setState({
      text,
    });

    const { onSearch } = this.props;
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      onSearch(text);
    }, 300);
  };

  render() {
    const { placeholder, onSearch, keyboardType, secureTextEntry, style, rightButton } = this.props;
    const { text } = this.state;
    const isAndroid = Platform.OS === 'android';
    const placeHolderText = placeholder ? I18n.t(placeholder) : I18n.t('COMMON_SEARCH');

    return (
      <InputTopSection style={style}>
        {_.size(text) === 0 && isAndroid && (
          <PlaceholderWrapper>
            <PlaceholderText numberOfLines={1} text={placeHolderText} />
          </PlaceholderWrapper>
        )}
        <SearchInput
          value={text}
          onChangeText={this.onChangeText}
          keyboardType={keyboardType || 'default'}
          secureTextEntry={secureTextEntry || false}
          onSubmitEditing={() => onSearch(text)}
          underlineColorAndroid="transparent"
          placeholder={!isAndroid ? placeHolderText : ''}
          placeholderTextColor="#9F9F9F"
        />
        {rightButton}
        <SearchTopSection>
          <SearchIcon source={icons.search} />
        </SearchTopSection>
      </InputTopSection>
    );
  }
}
