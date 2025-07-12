import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import moment from 'moment';
import I18n from '@I18n';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Text from './Text';

import LocaleConfig from '../Config/LocaleConfig';
import { icons } from '../Resources/icon';
import { Colors } from '../Themes';

const DatePicker = ({
  mode = 'date',
  value,
  onDateChange,
  disabled,
  minimumDate,
  maximumDate,
  containerStyle,
  small,
}) => {
  const dateFormat = LocaleConfig.dateTimeFormat;
  const timeFormat = LocaleConfig.timeFormat;
  const dateTimeFormat = `${dateFormat} - ${timeFormat}`;
  let format = timeFormat;
  if (mode === 'datetime') {
    format = dateTimeFormat;
  }

  if (mode === 'date') {
    format = dateFormat;
  }
  const displayText = value ? moment(value).format(format) : format;

  const [isDatePickerVisible, setDatePickerVisible] = React.useState(false);
  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleConfirm = (date) => {
    hideDatePicker();
    onDateChange(date);
  };

  const height = small ? 32 : 42;

  return (
      <TouchableOpacity
        style={[styles.dateContainer, { height }, containerStyle]}
        disabled={disabled}
        onPress={showDatePicker}
      >
          <Text typo="P3" text={displayText} style={value ? styles.title : styles.placeholder} />
          <View style={styles.iconContainer}>
              <Image
                source={icons.calendar}
                resizeMode="contain"
                style={[styles.calendarIcon, { tintColor: disabled ? Colors.border : Colors.azure }]}
              />
          </View>

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode={mode}
            date={value ? new Date(value) : undefined}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
            onConfirm={handleConfirm}
            confirmTextIOS={I18n.t('AD_COMMON_CONFIRM')}
            cancelTextIOS={I18n.t('AD_COMMON_CANCEL')}
            onCancel={hideDatePicker}
          />
      </TouchableOpacity>
  );
};
export default DatePicker;

const styles = StyleSheet.create({
  datePicker: {
    width: 'auto',
    flexWrap: 'wrap',
  },
  dateContainer: {
    height: 44,
    borderRadius: 22,
    borderWidth: 0.5,
    borderColor: Colors.border,
    backgroundColor: '#ffffff',
    paddingLeft: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 12,
    flex: 1,
  },
  placeholder: {
    flex: 1,
    color: Colors.border,
  },
  iconContainer: {
    // height: 44,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  dateText: {
    fontSize: 13,
    color: 'black',
  },
  calendarIcon: {
    width: 18,
    height: 18,
  },
});
