import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import _ from 'lodash';
import { Colors } from '../../Themes';
import LocaleConfig from '../../Config/LocaleConfig';

const SuffixLabel = ({ text }) => {
  if (_.size(text) > 0) {
    return <Text style={styles.suffix}>{text}</Text>;
  }
  return null;
};

class TextInputMoney extends Component {
  getRawValue() {
    return this.input.getRawValue();
  }

  render() {
    const {
      containerStyle,
      style = {},
      onChangeText,
      value,
      placeholder,
      includeSymbol = true,
      inputOptions,
      editable,
    } = this.props;
    const options = inputOptions || LocaleConfig.getInputOptions(includeSymbol);

    return (
      <View style={[styles.container, style, containerStyle, !editable && styles.disabledInput]}>
        <TextInputMask
          style={styles.input}
          underlineColorAndroid="transparent"
          type="money"
          placeholderTextColor="#BABFC8"
          placeholder={placeholder}
          enablesReturnKeyAutomatically
          includeRawValueInChangeText
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="number-pad"
          selectionColor={Colors.colorMain}
          ref={(c) => (this.input = c)}
          options={options}
          value={value}
          onChangeText={(text, rawValue) => onChangeText(text, rawValue)}
          editable={editable}
        />
        <SuffixLabel text={options.suffix} />
      </View>
    );
  }
}

export default TextInputMoney;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    // height: 20,
    alignItems: 'center',
    // backgroundColor: 'red'
  },
  input: {
    flex: 1,
    height: 42,
  },
  suffix: {
    paddingVertical: 0,
    marginVertical: 0,
    color: 'black',
    marginLeft: 10,
  },
  disabledInput: {
    backgroundColor: '#DEE0E4', // DarkGray color for disabled text
  },
});
