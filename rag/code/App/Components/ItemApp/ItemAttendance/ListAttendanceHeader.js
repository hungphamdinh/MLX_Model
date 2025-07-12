import React from 'react';
import styled from 'styled-components/native';
import { Text } from '@Elements';
import ShadowView from '@Elements/ShadowView';

const Wrapper = styled(ShadowView)`
  flex-direction: row;
  align-items: center;
  height: 40px;
  background-color: white;
  margin-bottom: 15px;
  padding-horizontal: 15px;
`;

const Title = styled(Text)`
  font-size: 12px;
  flex: 1;
  text-align: ${(props) => (props.center ? 'center' : 'left')};
`;

const ListAttendanceHeader = () => (
  <Wrapper>
    <Title preset="bold" text="ATTENDANCE_USER_TEAM" />
    <Title preset="bold" text="ATTENDANCE_TEMP_IN" center />
    <Title preset="bold" text="ATTENDANCE_TEMP_OUT" center />
    <Title preset="bold" text="ATTENDANCE_CHECK_IN" center />
    <Title preset="bold" text="ATTENDANCE_CHECK_OUT" center />
  </Wrapper>
);

export const ListAttendanceDetailHeader = () => (
  <Wrapper>
    <Title preset="bold" text="ATTENDANCE_USER" />
    <Title preset="bold" text="ATTENDANCE_TYPE" center />
    <Title preset="bold" text="ATTENDANCE_TEMPERATURE" center />
    <Title preset="bold" text="COMMON_DATE" center />
  </Wrapper>
);

export default ListAttendanceHeader;
