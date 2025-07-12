/**
 * Created by thienmd on 10/7/20
 */

import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { Text } from '@Elements';
import styles from './styles';

const Tag = ({ title, color, containerStyle, textStyle, ...props }) => (
  <View style={[styles.container, { backgroundColor: color }, containerStyle]}>
    <Text {...props} style={[styles.title, textStyle]} text={title} />
  </View>
);

export default React.memo(Tag);

Tag.propTypes = {
  title: PropTypes.string,
  color: PropTypes.string,
};

Tag.defaultProps = {
  title: '',
  color: '#E0EAF4',
};
