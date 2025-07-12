/**
 * Created by thienmd on 9/23/20
 */
import React from 'react';
import { TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { Text } from '@Elements';
import I18n from '@I18n';
import styles from './styles';

const SelectObjectItem = ({ name, onItemPress }) => (
  <TouchableOpacity onPress={onItemPress} style={styles.container}>
    <Text preset="medium" style={styles.leftTitle}>
      {I18n.t('COMMON_INSERT')}
    </Text>
    <Text style={styles.name}>{name}</Text>
  </TouchableOpacity>
);

export default React.memo(SelectObjectItem);

SelectObjectItem.propTypes = {
  name: PropTypes.string,
  onItemPress: PropTypes.func,
};

SelectObjectItem.defaultProps = {
  name: '',
  onItemPress: () => {},
};
