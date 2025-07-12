import React from 'react';
import styled from 'styled-components/native';
import { Text } from '@Elements';
import { Colors } from '@Themes';
import FormSwitch from '../../Forms/FormSwitch';

const Wrapper = styled.View`
  height: 60px;
  padding-horizontal: 14px;
  flex-direction: row;
  align-items: center;
  border-bottom-width: 1px;
  border-color: ${Colors.border};
`;

const Switch = styled(FormSwitch).attrs(() => ({
  containerStyle: {
    marginBottom: 0,
  },
}))`
  margin-left: 10px;
`;

const Title = styled(Text)`
  flex: 1;
  color: black;
`;

const Icon = styled.Image`
  width: 18px;
  height: 18px;
  margin-right: 16px;
  tint-color: black;
`;

const SettingNotificationItem = ({ displayName, icon, name }) => (
  <Wrapper>
    <Icon source={icon} resizeMode="contain" />
    <Title text={displayName} />
    <Switch name={`${name}.isSubscribedInApp`} />
    <Switch name={`${name}.isSubscribedEmail`} />
  </Wrapper>
);

export default SettingNotificationItem;
