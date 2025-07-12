import React, { useState } from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { FormInput } from '../../Forms';

const EyeWrapper = styled.TouchableOpacity`
  margin-right: 13px;
`;
export const FormPasswordInput = (props) => {
  const [secureText, setSecureText] = useState(true);

  const onSecureModeChange = () => {
    setSecureText(!secureText);
  };

  return (
    <FormInput
      secureTextEntry={secureText}
      rightIcon={
        <EyeWrapper onPress={onSecureModeChange}>
          <Icon name={secureText ? 'eye' : 'eye-off'} color="#B1B1B1" size={16} />
        </EyeWrapper>
      }
      {...props}
    />
  );
};

export default FormPasswordInput;
