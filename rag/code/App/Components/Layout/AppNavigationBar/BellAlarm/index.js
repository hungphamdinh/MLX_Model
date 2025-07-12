import React from 'react';
import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const BellWrapper = styled.TouchableOpacity``;

const BadgeWrapper = styled.View`
  align-items: center;
  justify-content: center;
  height: 13px;
  min-width: 13px;
  padding-horizontal: 3px;
  border-radius: 7.5px;
  background-color: #ffe136;
  border-width: 1px;
  border-color: white;
  position: absolute;
  top: 3px;
  left: 18px;
`;

const Badge = styled.Text`
  color: black;
  font-size: 8px;
`;

const BellAlarm = ({ unreadCount, onPress }) => (
  <BellWrapper onPress={onPress}>
    <Ionicons name="notifications" color="#001335" size={30} />
    {unreadCount > 0 && (
      <BadgeWrapper>
        <Badge>{unreadCount}</Badge>
      </BadgeWrapper>
    )}
  </BellWrapper>
);

export default BellAlarm;
