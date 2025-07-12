import React from 'react';
import Text from './Text';
import { Fonts } from '../Themes';

const Required = () => <Text fontFamily={Fonts.Bold} style={{ color: 'red' }} text=" *" />;

export default Required;
