/* @flow */

import React from 'react';
import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

import { Colors, Metric, ImageResource, Fonts } from '../../../Themes';
import { Button, Text, Icon } from '../../../Elements';
import I18n from '../../../I18n';
import Section from '../Section';

const WrapperForm = ({
  title,
  isRequire = true,
  onChangeText,
  content = title,
  inputProps,
  style,
  value,
  onPress,
  ...props
}) => {
  const { icon, isInput, disabled, titleStyle } = props;
  const rowCenterStyles = () => ({
    ...styles.rowCenter,
    paddingLeft: isInput ? 0 : 20,
  });

  return (
    <Section style={titleStyle} isRequire={isRequire} title={title}>
      <Button
        onPress={onPress === null ? () => {} : onPress}
        disabled={disabled}
        activeOpacity={isInput ? 1 : 0.1}
        style={[styles.rowCenter, style]}
      >
        <Text numberOfLines={1} color={Colors.textHeather}>
          {I18n.t(content)}
        </Text>

        <Button
          disabled={disabled}
          activeOpacity={isInput ? 1 : 0.1}
          onPress={onPress === null ? () => {} : onPress}
          style={rowCenterStyles()}
        >
          {isInput ? (
            <TextInput {...inputProps} onChangeText={(e) => onChangeText(e)} value={value} />
          ) : (
            <Text
              fontFamily={Fonts.Bold}
              value={value || '- -'}
              numberOfLines={1}
              style={{ flex: 1, textAlign: 'right' }}
              color={disabled ? Colors.textSemiGray : Colors.text}
            >
              {value || '- -'}
            </Text>
          )}
          {onPress === null ? null : (
            <Icon
              source={icon || ImageResource.IC_InvertedTriangle}
              size={icon ? Metric.iconSize15 : Metric.iconSize10}
              tintColor={disabled && Colors.bgSemiGray}
              style={{ marginLeft: Metric.space10 }}
            />
          )}
        </Button>
      </Button>
    </Section>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgMain,
  },
  titleBlock: {
    flexDirection: 'row',
    marginLeft: Metric.Space,
    marginRight: Metric.space5,
    marginTop: Metric.space10,
    marginBottom: Metric.space10,
  },
  rowCenter: {
    flexDirection: 'row',
    backgroundColor: Colors.bgWhite,
    paddingLeft: 20,
    paddingRight: 10,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    flex: 1,
  },
  textInput: {
    flex: 1,
    color: Colors.text,
  },
});
export default WrapperForm;
