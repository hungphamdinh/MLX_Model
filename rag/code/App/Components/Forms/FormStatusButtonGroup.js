// FormStatusButtonGroup.js
import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native';
import { Text } from '@Elements';
import FormControl, { useCommonFormController, commonFormStyles } from './FormControl';

// Styled wrappers
const Container = styled.View`
  margin-vertical: 10px;
`;

const ButtonGroupContainer = styled.View`
  flex-direction: ${(props) => (props.horizontal ? 'row' : 'column')};
  flex-wrap: wrap;
`;

const Border = styled.View`
  border-width: ${(props) => (props.active ? '2px' : '0px')};
  border-color: ${(props) => props.bgColor || '#000'};
  margin-right: 5px;
  margin-bottom: 5px;
  border-radius: 4px;
  padding: 2px;
`;

const Button = styled(TouchableOpacity)`
  padding: 8px;
  border-radius: 4px;
  background-color: ${(props) => props.bgColor || '#000'};
`;

const ButtonText = styled(Text)`
  color: #fff;
`;

// FormStatusButtonGroup component that integrates with react-hook-form
const FormStatusButtonGroup = ({
  label,
  options,
  name,
  valueField = 'statusCode',
  colorField = 'colorCode',
  textField = 'name',
  containerStyle,
  horizontal = true,
  required,
  mode,
  ...restProps
}) => {
  // Use the common form controller to get current field value, setter, and error.
  const { value, setFieldValue, error } = useCommonFormController(name);
  let styleLabel;
  if (mode === 'small') {
    styleLabel = commonFormStyles.small.styleLabel;
  }

  const onValueChange = (optionValue) => {
    setFieldValue(optionValue);
  };

  return (
    <FormControl label={label} error={error} styleLabel={styleLabel} style={containerStyle} required={required}>
      <Container>
        <ButtonGroupContainer horizontal={horizontal} {...restProps}>
          {options.map((item, index) => {
            const optionValue = item[valueField];
            const bgColor = item[colorField];
            const buttonText = textField ? item[textField] : optionValue;
            const active = value[valueField] === optionValue;
            return (
              <Border bgColor={bgColor} active={active}>
                <Button
                  key={optionValue || index}
                  bgColor={bgColor}
                  active={active}
                  onPress={() => onValueChange(item)}
                  testID={`form-status-button-${optionValue}`}
                >
                  <ButtonText text={buttonText} />
                </Button>
              </Border>
            );
          })}
        </ButtonGroupContainer>
      </Container>
    </FormControl>
  );
};

export default FormStatusButtonGroup;
