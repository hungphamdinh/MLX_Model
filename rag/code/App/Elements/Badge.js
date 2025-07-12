/**
 * Created by thienmd on 11/2/20
 */

/**
 * Created by thienmd on 10/26/20
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Text from './Text';

const Badge = ({ badge }) =>
  badge > 0 ? (
    <View style={styles.container}>
      <Text preset="medium" style={styles.badge}>
        {badge}
      </Text>
    </View>
  ) : null;

export default Badge;

Badge.propTypes = {
  badge: PropTypes.number,
};

Badge.defaultProps = {
  badge: 0,
};

const styles = StyleSheet.create({
  container: {
    height: 18,
    minWidth: 18,
    paddingHorizontal: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFE136',
    borderRadius: 9,
    borderWidth: 2,
    borderColor: 'white',
    position: 'absolute',
    top: -9,
    right: -9,
  },
  badge: {
    color: 'black',
    fontSize: 10,
  },
});
