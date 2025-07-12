import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import I18n from '../../../I18n';
import ConfigRecurrenceModal from './RecurrenceModal';
import InfoText from '../../InfoText';
import { Colors } from '../../../Themes';
import { useCommonFormController } from '../../Forms/FormControl';

const BookingRecurring = ({ onSubmitForm, schedule, name, ...props }) => {
  const [visible, setVisible] = useState(false);
  const { value } = useCommonFormController('recurrence');

  const onBtRepeatPress = () => {
    setVisible(true);
  };

  const color = value ? Colors.text : Colors.placeholder;
  return (
    <View>
      <TouchableOpacity testID="recurrence-button" style={{ marginBottom: 20, marginTop: -10 }} onPress={onBtRepeatPress}>
        <InfoText
          testID="recurrence-info"
          textStyle={{ color, marginLeft: 0, fontSize: 12 }}
          iconSize={20}
          iconColor={Colors.azure}
          icon="caret-down"
          paddingLeftLabel={0}
          label="AD_PM_REPEAT"
          value={value ? value.frequency.name : I18n.t('COMMON_SELECT')}
          labelStyle={{fontSize: 12, fontWeight: 100}}
          containerStyle={{borderWidth: 1, borderColor: Colors.light, height: 30}}
        />
      </TouchableOpacity>

      <ConfigRecurrenceModal
        {...props}
        schedule={schedule}
        onSubmitForm={onSubmitForm}
        onClose={() => setVisible(false)}
        visible={visible}
        testID="recurrence-modal"
      />
    </View>
  );
};

export default BookingRecurring;
