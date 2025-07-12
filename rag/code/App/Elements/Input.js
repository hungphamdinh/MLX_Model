import React, { Component } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Colors } from '@Themes';
import I18n from '@I18n';

import PropTypes from 'prop-types';
import Text from './Text';
import Row from '../Components/Grid/Row';

export default class Input extends Component {
  focus = () => {
    this.input.focus();
  };

  render() {
    const {
      style,
      containerStyle,
      label,
      border,
      multiline,
      maxHeight = 80,
      value,
      leftIcon,
      placeholder,
      rightIcon,
      editable,
      autoHeight,
      mode,
      showCharacterCount,
      ...rest
    } = this.props;

    const minHeight = mode === 'small' ? 32 : 42;

    const borderRadius = multiline ? 12 : minHeight / 2;
    let textValue = value;
    if (typeof textValue === 'number') {
      textValue = String(textValue);
    }

    const comp = (
      <View style={styles.wrapper}>
        <Row
          center
          style={[
            styles.container,
            containerStyle,
            { borderRadius, minHeight, maxHeight, height: autoHeight ? undefined : minHeight },
            multiline && !autoHeight && styles.multiline,
            editable === false && styles.disabled,
          ]}
        >
          {leftIcon}
          <TextInput
            ref={(input) => (this.input = input)}
            placeholder={I18n.t(placeholder)}
            placeholderTextColor={Colors.placeholder}
            value={value && String(value)}
            style={[styles.input, style]}
            multiline={multiline}
            editable={editable}
            {...rest}
          />
          {rightIcon}
        </Row>
        {showCharacterCount && (
          <Text style={styles.textCount} text={I18n.t('INPUT_MAX_LENGTH', undefined, rest.maxLength - value.length)} />
        )}
      </View>
    );

    if (label) {
      return (
        <View style={[styles.container, containerStyle]}>
          <Text style={styles.label}>{label}</Text>
          {comp}
        </View>
      );
    }
    return comp;
  }
}

Input.propTypes = {
  label: PropTypes.string,
  border: PropTypes.bool,
  multiline: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Input.defaultProps = {
  label: undefined,
  border: true,
  multiline: false,
  value: '',
};

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    marginBottom: 8,
  },
  container: {
    paddingHorizontal: 12,
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    fontFamily: 'Gotham-Book',
    fontSize: 12,
    paddingVertical: 0,
    height: '100%',
    maxHeight: 80,
    color: Colors.text,
  },
  multiline: {
    height: 80,
  },
  disabled: {
    backgroundColor: Colors.disabled,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  textCount: {
    marginTop: 5,
  },
  wrapper: {
    flexDirection: 'column',
    flex: 1,
  },
});
