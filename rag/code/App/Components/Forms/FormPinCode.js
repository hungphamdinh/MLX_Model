import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@Elements';
import styled from 'styled-components/native';
import _ from 'lodash';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
  MaskSymbol,
  isLastFilledCell,
} from 'react-native-confirmation-code-field';
import { useCommonFormController } from './FormControl';

const Error = styled.Text`
  color: #ff0000;
  font-size: 12px;
  text-align: center;
  margin-top: 20px;
`;

const FormPinCode = ({
  cellCount = 6,
  name,
  fontSize = 30,
  haveError,
  errorMessage,
  onCompleteInput,
  secureText = false,
}) => {
  const { value, setFieldValue } = useCommonFormController(name);
  const ref = useBlurOnFulfill({ value, cellCount });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue: setFieldValue,
  });

  const onCodeChange = (text) => {
    setFieldValue(text);
    if (_.size(text) === cellCount && onCompleteInput) {
      onCompleteInput(text);
    }
  };

  const renderCell = ({ index, symbol, isFocused }) => {
    let textChild = symbol;

    if (secureText && symbol) {
      textChild = (
        <MaskSymbol maskSymbol="*" isLastFilledCell={isLastFilledCell({ index, value })}>
          {symbol}
        </MaskSymbol>
      );
    }

    if (isFocused) {
      textChild = <Cursor />;
    }

    return (
      <View
        onLayout={getCellOnLayoutHandler(index)}
        key={index}
        style={[styles.cellRoot, isFocused && styles.focusCell, haveError && styles.errorCell]}
      >
        <Text style={[styles.cellText, { fontSize }]}>{textChild}</Text>
      </View>
    );
  };

  return (
    <View>
      {haveError && <Error>{i18n.t(errorMessage)}</Error>}
      <CodeField
        ref={ref}
        {...props}
        value={value}
        onChangeText={onCodeChange}
        cellCount={cellCount}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={renderCell}
      />
    </View>
  );
};

export default FormPinCode;

const styles = StyleSheet.create({
  root: { padding: 20, minHeight: 300 },
  title: { textAlign: 'center', fontSize: 30 },
  codeFieldRoot: {
    marginTop: 20,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  cellRoot: {
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    height: 40,
    flex: 1,
  },
  cellText: {
    color: '#000',
    textAlign: 'center',
  },
  focusCell: {
    borderBottomColor: '#007AFF',
    borderBottomWidth: 2,
  },
  errorCell: {
    borderBottomColor: 'red',
    borderBottomWidth: 2,
  },
});
