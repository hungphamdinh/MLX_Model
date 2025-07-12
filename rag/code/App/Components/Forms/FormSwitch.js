/**
 * Created by thienmd on 3/26/20
 */
import React from 'react';
import { StyleSheet, Switch } from 'react-native';
import { Text } from '@Elements';
import I18n from '@I18n';
import PropTypes from 'prop-types';

import Row from '../Grid/Row';
import FormControl, { useCommonFormController } from './FormControl';

const FormSwitch = ({ label, translate, name, onChange, ...props }) => {
  const { setFieldValue, value } = useCommonFormController(name);

  const onValueChange = (val) => {
    setFieldValue(val);
    if (onChange) {
      onChange(val);
    }
  };

  return (
    <FormControl>
      <Row center>
        <Text style={styles.label}>{translate ? I18n.t(label) : label}</Text>
        <Switch {...props} value={value} onValueChange={onValueChange} />
      </Row>
    </FormControl>
  );
};

export default FormSwitch;

FormSwitch.defaultProps = {
  translate: true,
};

FormControl.propTypes = {
  translate: PropTypes.bool,
};

const styles = StyleSheet.create({
  label: {
    flex: 1,
    color: 'gray',
    fontWeight: 'bold',
  },
});
