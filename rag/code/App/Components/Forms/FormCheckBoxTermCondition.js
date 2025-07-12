/**
 * Created by thienmd on 3/20/20
 */

import React, { useState } from 'react';
import { LayoutAnimation, StyleSheet, TouchableOpacity } from 'react-native';
import ModalTermCondition from '../../Modal/ModalTermCondition';
import { CheckBox } from './FormCheckBox';
import Row from '../Grid/Row';
import { Text } from '../../Elements';
import FormControl, { useCommonFormController } from './FormControl';

const FormCheckboxTermCondition = ({
  error,
  label,
  required,
  styleLabel,
  style,
  showDetailModel = true,
  name,
  ...props
}) => {
  const { value, setFieldValue } = useCommonFormController(name);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const onCheckBoxPress = () => {
    setFieldValue(!value);
  };

  const onAcceptTermCondition = () => {
    setFieldValue(true);
    setIsModalVisible(false);
  };

  const hideOrShowModal = (isShow) => {
    if (showDetailModel) {
      setIsModalVisible(isShow);
    }
  };

  return (
    <FormControl style={style} styleLabel={styleLabel} error={error} required={required}>
      <TouchableOpacity style={styles.content} disabled={!showDetailModel} onPress={() => hideOrShowModal(true)}>
        <Row>
          <CheckBox
            // label="BK_NEW_ACCEPTED"
            value={value}
            labelFirst
            onCheckBoxPress={onCheckBoxPress}
            containerStyle={styles.checkboxWrapper}
          />
          <Text>
            <Text text={label} style={styles.textLabel} />
            {required && <Text style={styles.requiredMark} text=" *" />}
          </Text>
        </Row>
      </TouchableOpacity>
      <ModalTermCondition
        modalVisible={isModalVisible}
        termConditionContent={props.termConditionContent}
        onClose={() => hideOrShowModal(false)}
        onPressAcceptTermCondition={onAcceptTermCondition}
      />
    </FormControl>
  );
};

const styles = StyleSheet.create({
  textWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxWrapper: {
    marginBottom: 0,
    marginLeft: -10,
    flex: 0,
    marginRight: 10,
  },
  touchLabelWrapper: {
    flex: 1,
  },
  requiredMark: {
    color: 'red',
  },
  textLabel: {
    fontFamily: 'OpenSans-SemiBold',
    color: 'black',
    fontSize: 12,
    flexDirection: 'row',
    alignItems: 'center',
    display: 'flex',
    paddingLeft: 0,
    textDecorationLine: 'underline',
  },
  content: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
});

export default FormCheckboxTermCondition;
