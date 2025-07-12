/**
 * Created by thienmd on 9/23/20
 */
import React from 'react';
import { TouchableOpacity, Image, View } from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';

import styles from './styles';
import Row from '../../Grid/Row';
import { ImageResource } from '../../../Themes';
import { Text } from '../../../Elements';

const PropertyItem = (props) => {
  const { id, name, propertyType, onItemPress, address } = props;

  return (
    <TouchableOpacity onPress={() => onItemPress(id)} style={styles.container}>
      <View style={styles.infoWrapper}>
        <Row center>
          <Row center style={styles.rowWrapper}>
            <Row style={styles.propertyName}>
              <Image source={ImageResource.IMG_INSPECTION_PROPERTY} style={styles.building} resizeMode="contain" />
              <Text medium style={styles.title}>
                {name}
              </Text>
            </Row>

            <View style={styles.propertyTypeLabel}>
              <Text typo="P2" preset="bold" style={styles.propertyTypeText}>
                {propertyType.name}
              </Text>
            </View>
          </Row>
        </Row>

        {_.size(address) > 0 && <Text style={styles.address} numberOfLines={2}>{`${address}`}</Text>}
      </View>
    </TouchableOpacity>
  );
};
export default React.memo(PropertyItem);

PropertyItem.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  address: PropTypes.string,
  name: PropTypes.string,
  onItemPress: PropTypes.func,
  propertyType: PropTypes.shape({
    name: PropTypes.string,
  }),
};

PropertyItem.defaultProps = {
  id: 0,
  address: '',
  name: '',
  propertyType: {
    name: '',
  },
  onItemPress: () => {},
};
