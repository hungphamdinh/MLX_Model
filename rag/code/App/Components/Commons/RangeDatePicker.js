import React from 'react';
import styled from 'styled-components/native';
import _ from 'lodash';
import DatePicker from '../../Elements/DatePicker';
import i18n from '@I18n';
import Row from '../Grid/Row';
import { Text } from '../../Elements';

const DateLabel = styled(Text)`
  color: black;
  margin-bottom: 10px;
`;

const FromDateInput = styled.View`
  flex: 1;
  margin-right: 10px;
`;

const ToDateInput = styled.View`
  flex: 1;
`;

const Wrapper = styled.View`
  margin-top: 10px;
`;

const ModalDateRange = (props) => {
  const [fromDate, setFromDate] = React.useState(undefined);
  const [toDate, setToDate] = React.useState(undefined);
  React.useEffect(() => {
    setFromDate(props.fromDate);
    setToDate(props.toDate);
  }, [props]);

  const onFromDateChanged = (date) => {
    setFromDate(date);
    props.onDateChange(date, toDate);
  };

  const onToDateChanged = (date) => {
    if (fromDate > date) {
      alert(i18n.t('COMMON_FROM_DATE_TO_DATE_VALIDATE'));
      return;
    }
    setToDate(date);
    props.onDateChange(fromDate, date);
  };

  return (
    <Row center>
      <FromDateInput>
        <DateLabel preset="medium" text="COMMON_FROM" />
        <DatePicker mode="date" placeholder="COMMON_FROM" value={fromDate} onDateChange={onFromDateChanged} />
      </FromDateInput>
      <ToDateInput>
        <DateLabel preset="bold" text="COMMON_TO" />
        <DatePicker mode="date" placeholder="COMMON_TO" value={toDate} onDateChange={onToDateChanged} />
      </ToDateInput>
    </Row>
  );
};
const RangeDatePiker = ({ fromDate, toDate, onDateChange, containerStyle }) => (
  <Wrapper style={containerStyle}>
    <ModalDateRange fromDate={fromDate} toDate={toDate} onDateChange={onDateChange} />
  </Wrapper>
);

export default RangeDatePiker;
