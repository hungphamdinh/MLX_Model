/**
 * Created by thienmd on 10/9/20
 */
import React from 'react';
import { StyleSheet, TouchableOpacity, ViewPropTypes } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';
import _ from 'lodash';

const IconButton = ({ name, color, size, icon, style, containerStyle, ...restProps }) => (
  <TouchableOpacity {...restProps} style={[styles.container, containerStyle]}>
    {icon && icon}
    {_.size(name) > 0 && <Icon size={size} name={name} style={[styles.icon]} color={color} />}
  </TouchableOpacity>
);

export default IconButton;

IconButton.propTypes = {
  name: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.number,
};

IconButton.defaultProps = {
  name: '',
  color: 'black',
  size: 20,
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    width: 30,
  },
});
