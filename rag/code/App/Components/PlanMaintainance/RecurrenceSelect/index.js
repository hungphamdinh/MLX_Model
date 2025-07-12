import React, { useState } from 'react';
import { View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import I18n from '../../../I18n';
import ConfigRecurrenceModal from './ConfigRecurrenceModal';
import InfoText from '../../InfoText';
import { Colors } from '../../../Themes';
import { useCommonFormController } from '../../Forms/FormControl';

const RecurrenceSetting = ({ onSubmitForm, schedule, name, ...props }) => {
  const [visible, setVisible] = useState(false);
  const { value } = useCommonFormController('recurrence');

  const onBtRepeatPress = () => {
    setVisible(true);
  };

  const color = value ? Colors.text : Colors.placeholder;
  return (
    <View>
      <TouchableOpacity style={{ marginBottom: 20, marginTop: -20 }} onPress={onBtRepeatPress}>
        <InfoText
          textStyle={{ color, marginLeft: 0 }}
          iconSize={20}
          iconColor={Colors.azure}
          icon="caret-down"
          paddingLeftLabel={0}
          label="AD_PM_REPEAT"
          value={value ? value.frequency.name : I18n.t('COMMON_SELECT')}
        />
      </TouchableOpacity>

      <ConfigRecurrenceModal
        {...props}
        schedule={schedule}
        onSubmitForm={onSubmitForm}
        onClose={() => setVisible(false)}
        visible={visible}
      />
    </View>
  );
};

export default RecurrenceSetting;
