import React from 'react';

import { View } from 'react-native';
import _ from 'lodash';
import I18n from '@I18n';
import { Metric } from '@Themes';

import { Text, Spacer, DatePicker } from '@Elements';
import FormControl from '../../Forms/FormControl';
import { Separator } from './FilterSection';

export const FilterWrapper = ({ children, title }) => (
  <View>
    {_.size(title) > 0 && <Text preset="medium">{I18n.t(title)}</Text>}
    <Separator />
    <View
      style={{
        marginTop: Metric.space10,
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      {children}
    </View>
  </View>
);

export const FilterDateSection = ({ title, dateRange, onChange }) => {
  const onFromDateChange = (date) => {
    const startDate = new Date(date.getTime());
    startDate.setHours(0, 0, 0);
    dateRange.fromDate = startDate;
    onChange(dateRange);
  };

  const onToDateChange = (date) => {
    const endDate = new Date(date.getTime());
    endDate.setHours(23, 59, 59);
    dateRange.toDate = endDate;
    onChange(dateRange);
  };

  return (
    <FilterWrapper title={title}>
      <FormControl label="COMMON_FROM" style={styles.formControl}>
        <DatePicker
          containerStyle={styles.dateContainer}
          mode="date"
          onDateChange={onFromDateChange}
          value={dateRange.fromDate}
          maximumDate={dateRange.toDate}
          placeholder="COMMON_FROM"
        />
      </FormControl>
      <Spacer width={15} />
      <FormControl label="COMMON_TO" style={styles.formControl}>
        <DatePicker
          containerStyle={styles.dateContainer}
          mode="date"
          onDateChange={onToDateChange}
          value={dateRange.toDate}
          minimumDate={dateRange.fromDate}
          placeholder="COMMON_TO"
        />
      </FormControl>
    </FilterWrapper>
  );
};

export default FilterDateSection;

const styles = {
  dateContainer: {
    height: 33,
  },
  formControl: {
    flex: 1,
    marginBottom: 0,
  },
};
