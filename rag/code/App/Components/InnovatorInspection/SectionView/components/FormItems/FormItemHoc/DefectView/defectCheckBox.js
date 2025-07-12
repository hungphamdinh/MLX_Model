import React from 'react';
import styled from 'styled-components/native';
import { CheckBox } from '@Elements';
import { Colors } from '@Themes';
import PropTypes from 'prop-types';

// Styled Components
const CheckboxContainer = styled.View`
  margin-left: ${({ checked }) => (!checked ? 22 : 0)};
`;

const DefectCheckBox = ({ disabled, isDefect, isError, setValue, formName }) => {
  const color = disabled ? Colors.light : isError ? 'red' : '#4A89E8';
  const backgroundColor = isDefect ? Colors.azure : 'white';

  const handleCheck = (value) => {
    setValue(`${formName}.isDefect`, value);
    if (!value) {
      setValue(`${formName}.uaqDefectDescription`, '');
    }
  };

  return (
    <CheckboxContainer checked={isDefect}>
      <CheckBox
        styleCheckBox={{
          borderColor: color,
          borderWidth: 1.5,
          marginRight: 5,
          backgroundColor,
        }}
        size={22}
        checked={isDefect}
        disabled={disabled}
        onPressCheck={handleCheck}
      />
    </CheckboxContainer>
  );
};

DefectCheckBox.propTypes = {
  disabled: PropTypes.bool,
  isError: PropTypes.bool,
  setValue: PropTypes.func.isRequired,
  formName: PropTypes.string.isRequired,
};

DefectCheckBox.defaultProps = {
  disabled: false,
  isError: false,
};

export default DefectCheckBox;
