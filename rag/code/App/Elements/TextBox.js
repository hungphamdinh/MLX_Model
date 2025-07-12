import React from 'react';
import { StyleSheet } from 'react-native';
import { Colors } from '@Themes';
import Text from './Text';
import FormControl, { commonFormStyles } from '../Components/Forms/FormControl';

const TextBox = ({
  style,
  label,
  containerStyle,
  text,
  mode,
  required,
  multiline,
  isDynamicHeight,
  textStyle,
  disabled,
  ...rest
}) => {
  let styleLabel;
  if (mode === 'small') {
    styleLabel = commonFormStyles.small.styleLabel;
  }
  const comp = (
    <Text
      style={[
        styles.textContainer,
        !isDynamicHeight && { height: multiline ? 80 : 35 },
        disabled && { backgroundColor: Colors.disabled },
      ]}
      text={text}
      {...rest}
    />
  );
  return (
    <FormControl label={label} required={required} styleLabel={styleLabel} style={style}>
      {comp}
    </FormControl>
  );
};
export default TextBox;
const styles = StyleSheet.create({
  textContainer: {
    borderColor: Colors.border,
    backgroundColor: Colors.bgWhite,
    borderWidth: 1,
    borderRadius: 17.5,
    paddingVertical: 8,
    paddingHorizontal: 10,
    overflow: 'hidden',
  },
});
