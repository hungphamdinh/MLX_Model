/* @flow */

import React, { useState } from 'react';
import { Modal, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import I18n from '../../../I18n';
import WrapperForm from '../../../Components/Delivery/WrapperForm';
import { Icon, Text, SearchBar } from '../../../Elements';
import AppList from '../../../Components/Lists/AppList';
import ItemMember from '../../../Components/Delivery/ItemMember';
import { Metric, ImageResource, Colors } from '../../../Themes';
import styled from 'styled-components/native';

const Wrapper = styled.SafeAreaView`
  flex: 1;
  background-color: #f5f5f5;
`;

const HeaderWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  background-color: white;
  padding: ${Metric.space15}px;
`;

const MembersUnit = (
  {
    onPress,
    onChangeText,
    values,
    disabled,
    membersUnit,
    getMembersUnit,
    style,
    addNonRegisteredUser = true,
    title = I18n.t('DELIVERY_RECEIVER_INFORMATION'),
  },
  props
) => {
  const [visible, setVisible] = useState(false);
  const [key, setKeyword] = useState('');

  const isAddNonRegisteredUser = addNonRegisteredUser && key !== '';
  const getList = (page = 1, keyword = key) => {
    const params = {
      // page,
      keyword,
      unitIds: values.unit?.id,
    };
    getMembersUnit(params);
  };

  const showMemberModal = () => {
    setVisible(true);
    getList(1, '');
  };

  const changeKeyWord = (val) => {
    setKeyword(val);
    setTimeout(() => {
      getList(1, val);
    }, 300);
  };

  const onPressItem = (val) => {
    setVisible(false);
    onPress(val);
  };

  const listProps = {
    data: membersUnit,
    numColumns: 1,
    showsVerticalScrollIndicator: false,
    renderItem: ({ item, index }) => <ItemMember index={index} item={item} onPressItem={onPressItem} />,
    isRefresh: false,
    onRefresh: () => getList(),
    loadData: () => getList(),
    keyExtractor: (item, index) => index.toString(),
  };

  const inputProps = {
    style: {
      flex: 1,
      textAlign: 'right',
    },
  };

  const closeModal = () => {
    setVisible(!visible);
  };

  const changeText = (val) => {
    onChangeText(val);
  };

  const onPressAdd = () => {
    closeModal();
    if (key !== '') {
      changeText(key);
      setKeyword('');
    }
  };

  return (
    <View style={style}>
      <WrapperForm
        disabled={disabled}
        inputProps={inputProps}
        {...props}
        onPress={showMemberModal}
        onChangeText={changeText}
        value={values.displayName}
        title={title}
        content={I18n.t('AD_CRWO_DISPLAYNAME')}
      />
      <WrapperForm
        disabled={disabled}
        style={{ marginTop: -50, borderRadius: 0 }}
        isRequire={false}
        {...props}
        onPress={showMemberModal}
        value={values.member?.emailAddress}
        content={I18n.t('AD_CRWO_EMAIL')}
      />
      <WrapperForm
        disabled={disabled}
        style={{ marginTop: -50, borderRadius: 0 }}
        isRequire={false}
        {...props}
        onPress={showMemberModal}
        value={values.member?.phoneNumber}
        content={I18n.t('AD_CRWO_PHONE')}
      />
      <Modal presentationStyle="formSheet" visible={visible} animationType="slide">
        <Wrapper>
          <HeaderWrapper>
            <TouchableOpacity onPress={closeModal}>
              <Icon source={ImageResource.IC_Close} size={Metric.iconSize20} tintColor={Colors.textHeather} />
            </TouchableOpacity>
            <Text style={{ marginLeft: isAddNonRegisteredUser ? -5 : -Metric.space20 }}>
              {I18n.t('DELIVERY_RECEIVER_INFORMATION')}
            </Text>
            {isAddNonRegisteredUser ? (
              <TouchableOpacity onPress={onPressAdd}>
                <Icon source={ImageResource.IC_Plus} size={Metric.iconSize20} />
              </TouchableOpacity>
            ) : (
              <Text />
            )}
          </HeaderWrapper>
          <View>
            <SearchBar
              placeholder={I18n.t('COMMON_SEARCH')}
              onSearch={changeKeyWord}
              style={{ marginHorizontal: Metric.space20 }}
            />
          </View>
          <AppList {...listProps} />
        </Wrapper>
      </Modal>
    </View>
  );
};

export default MembersUnit;
