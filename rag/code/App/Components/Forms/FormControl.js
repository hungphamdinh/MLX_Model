/**
 * Created by thienmd on 3/20/20
 */
import React from 'react';
import { StyleSheet, Text as NativeText, View } from 'react-native';
import _ from 'lodash';
import I18n from '@I18n';
import PropTypes from 'prop-types';
import { useController, useFormContext } from 'react-hook-form';

import { Colors } from '../../Themes';
import { Text } from '../../Elements';
import Row from '../Grid/Row';

export const useCommonFormController = (name) => {
  const formContext = useFormContext();
  const {
    control,
    formState: { errors },
  } = formContext;

  const error = errors[name]?.message;

  const { field } = useController({ name, control });
  return {
    value: field.value,
    setFieldValue: field.onChange,
    error,
    field,
    control,
    formState: formContext.formState,
  };
};

const FormControl = ({
  label,
  styleLabel,
  required,
  error,
  children,
  style,
  labelChild,
  rightButton,
  buttonRightStyles,
}) => (
  <View style={[styles.container, style]}>
    {_.size(label) > 0 && (
      <Row center>
        <Text preset="medium" typo="H3" style={[styles.label, styleLabel]}>
          {I18n.t(label)} {required && <NativeText style={styles.requiredMark}>*</NativeText>}
        </Text>
        {rightButton && <View style={[styles.rightView, buttonRightStyles]}>{rightButton}</View>}
        {labelChild}
      </Row>
    )}
    {children}
    {error && (
      <Text typo="H2" style={styles.error}>
        {error}
      </Text>
    )}
  </View>
);

export default FormControl;

FormControl.defaultProps = {
  required: false,
  label: '',
};

FormControl.propTypes = {
  required: PropTypes.bool,
  label: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  label: {
    color: '#001335',
    marginBottom: 9,
    alignItems: 'baseline',
    textTransform: 'capitalize',
  },
  requiredMark: {
    color: 'red',
  },
  error: {
    marginTop: 10,
    color: 'red',
  },
  icon: {
    backgroundColor: 'white',
    width: 39,
    height: 39,
    borderRadius: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 6,
  },
  iconImage: {
    width: 17,
    height: 17,
  },
  rightView: {
    flex: 1,
    alignItems: 'flex-end',
  },
});

export const commonFormStyles = {
  noBorder: {
    containerStyle: {
      borderWidth: 0,
    },
    multiline: {
      borderRadius: 10,
    },
  },
  small: {
    containerStyle: {
      borderWidth: 1,
      borderRadius: 16,
      height: 32,
      borderColor: Colors.border,
    },
    styleLabel: {
      color: 'black',
      fontSize: 12,
      fontFamily: 'Gotham-Book',
      fontWeight: 'normal',
    },
  },
};
