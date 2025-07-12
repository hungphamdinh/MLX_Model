/**
 * Created by thienmd on 3/20/20
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import I18n from '@I18n';
import Input from '@Elements/Input';
import FormControl, { commonFormStyles, useCommonFormController } from './FormControl';
import Row from '../Grid/Row';

export const AppInput = React.forwardRef(
  (
    {
      label,
      name,
      required,
      translate,
      suffixComponent,
      isNotFocusNextInput,
      placeholder,
      mode,
      style,
      containerStyle,
      multiline,
      value,
      error,
      setFieldValue,
      rightButton,
      onChangeText,
      ...props
    },
    ref
  ) => {
    let inputStyle;
    let styleLabel;
    if (mode === 'small') {
      inputStyle = commonFormStyles.small.containerStyle;
      styleLabel = commonFormStyles.small.styleLabel;
    }
    if (mode === 'noBorder') {
      inputStyle = {
        ...commonFormStyles.noBorder.containerStyle,
        ...(props.multiline ? commonFormStyles.noBorder.multiline : undefined),
      };
    }

    return (
      <FormControl
        label={label}
        error={error}
        translate={translate}
        required={required}
        styleLabel={styleLabel}
        style={style}
        rightButton={rightButton}
      >
        <Row center>
          <Input
            ref={ref}
            style={[styles.input, style]}
            containerStyle={[inputStyle, containerStyle]}
            placeholder={I18n.t(placeholder)}
            border
            multiline={multiline}
            mode={mode}
            onChangeText={(text) => {
              if (onChangeText) {
                onChangeText(text);
              }
              if (setFieldValue) {
                setFieldValue(text);
              }
            }}
            {...props}
            value={value}
            onSubmitEditing={isNotFocusNextInput ? () => {} : props.onSubmitEditing}
          />
          {suffixComponent}
        </Row>
      </FormControl>
    );
  }
);

const FormInput = ({ name, ...restProps }) => {
  const { value, setFieldValue, error } = useCommonFormController(name);
  return <AppInput value={value} setFieldValue={setFieldValue} error={error} {...restProps} />;
};

export default FormInput;

const styles = StyleSheet.create({
  input: {
    flex: 1,
  },
});
