import React from 'react';
import styled from 'styled-components/native';
import { Text } from '@Elements';
import get from 'lodash/get';
import moment from 'moment';
import LocaleConfig from '../../../Config/LocaleConfig';

const Wrapper = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
  padding-horizontal: 15px;
`;

const UserName = styled(Text)`
  font-size: 12px;
  color: black;
`;

const Box = styled.View`
  border-color: ${(props) => (props.isNotWell ? 'red' : '#cbcbcb')};
  border-width: 1px;
  width: 50px;
  height: 40px;
  align-items: center;
  justify-content: center;
`;

const Value = styled(Text)`
  font-size: 12px;
  color: ${(props) => (props.isNotWell ? 'red' : 'black')};
`;

const DateTime = styled(Value)`
  text-align: center;
`;

const Col = styled.View`
  flex: 1;
  align-items: center;
`;

const UserNameWrapper = styled(Col)`
  align-items: flex-start;
`;

const TextBox = ({ text, isNotWell, children }) => (
  <Box isNotWell={isNotWell}>{children || <Value isNotWell={isNotWell} text={text || '----'} />}</Box>
);

const getDateTime = ({ localAttendanceTime, localAttendanceDate }) => {
  const strDate = localAttendanceDate
    ? moment(localAttendanceDate).format(`${LocaleConfig.dateTimeFormat}`)
    : '--/--/----';
  const strTime = localAttendanceTime ? localAttendanceTime.slice(0, 5) : '--:--';

  return `${strDate}\n${strTime}`;
};

const formatTemperature = (temperature) => {
  if (temperature) {
    return LocaleConfig.formatNumber(temperature, 1);
  }
  return undefined;
};

const ItemAttendance = ({ item, onPress }) => {
  const { team, user } = item;
  const checkIn = get(item, 'checkIn', {});
  const checkOut = get(item, 'checkOut', {});
  const teamName = get(team, 'name', '');
  const userName = get(user, 'displayName', '');

  return (
    <Wrapper onPress={onPress}>
      <UserNameWrapper>
        <UserName preset="bold" text={userName} />
        <Value text={teamName} />
      </UserNameWrapper>
      <Col>
        <TextBox text={formatTemperature(checkIn.temperature)} isNotWell={checkIn.temperature && !checkIn.isWell} />
      </Col>
      <Col>
        <TextBox text={formatTemperature(checkOut.temperature)} isNotWell={checkOut.temperature && !checkOut.isWell} />
      </Col>

      <Col>
        <DateTime text={getDateTime(checkIn)} />
      </Col>
      <Col>
        <DateTime text={getDateTime(checkOut)} />
      </Col>
    </Wrapper>
  );
};

export const ItemAttendanceDetail = ({ item }) => {
  const userName = get(item, 'creatorUser.displayName') || '';
  const stateCheck = get(item, 'state');

  return (
    <Wrapper disabled>
      <UserNameWrapper>
        <UserName preset="bold" text={userName} />
      </UserNameWrapper>
      <Col>
        <Value text={stateCheck === 0 ? 'ATTENDANCE_CHECK_IN' : 'CHECKOUT_TEXT'} />
      </Col>
      <Col>
        <TextBox text={formatTemperature(item.temperature)} isNotWell={item.temperature && !item.isWell} />
      </Col>
      <Col>
        <DateTime text={getDateTime(item)} />
      </Col>
    </Wrapper>
  );
};

export default ItemAttendance;
