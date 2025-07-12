import React from 'react';
import { Button, Text } from '../../../../Elements';

const TextButton = ({ onPress, title, disabled }) => (
  <Button disabled={disabled} onPress={onPress}>
    <Text preset="bold" style={{ textDecorationLine: 'underline' }} text={title} />
  </Button>
);

export default TextButton;
