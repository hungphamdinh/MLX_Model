import React from 'react';
import { Colors } from '../Themes';
import Text from './Text';
import Icon from 'react-native-vector-icons/Ionicons';
import styled from 'styled-components/native';

// Styled Components

const Wrapper = styled.View`
  margin-left: 5px;
  border-radius: 10px;
  background-color: ${Colors.statuslow};
  height: 22px;
  padding-top: 3px;
  padding-horizontal: 8px;
`;

const Button = styled.TouchableOpacity`
  position: absolute;
  height: 20px;
  width: 20px;
  top: -10px;
  right: -13px;
  border-color: white;
  border-radius: 20px;
  border-width: 0.5px;
  background-color: ${Colors.azure};
`;

const Image = styled(Icon)`
  margin-left: 2px;
  margin-top: 1px;
`;

const StyledText = styled(Text)`
  font-size: 12px;
`;

const Tag = ({ text, containerStyle, textStyle, onPressRemove, showDelete, testID, ...props }) => (
  <Wrapper testID={testID} style={containerStyle}>
    {showDelete && <Button onPress={onPressRemove}>
      <Image testID="close-button" size={15} color="white" name="close" />
    </Button>}
    <StyledText {...props} style={textStyle} text={text} />
  </Wrapper>
);

export default Tag;