import React from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import I18n from '@I18n';
import { TouchableOpacity } from 'react-native';
import styles from './styles';
import { Icon, Text } from '../../../Elements';
import Row from '../../Grid/Row';
import { ImageResource, Fonts } from '../../../Themes';


const MemberItem = ({
  item, onItemPress, isSelected, disabled,
}) => {
  const onPress = () => {
    onItemPress(item);
  };
  return (
      <TouchableOpacity style={styles.wrapper} onPress={onPress} disabled={disabled}>
          <Row center>
              {
                  <MaterialIcon name={item.icon} size={25} style={styles.icon} />
      }
              <Text fontFamily={Fonts.SemiBold} style={styles.itemTitle}>
                  {`${item.displayName} ${item.isProvider ? `(${I18n.t('PROPERTY_VENDOR')})` : ''}`}
              </Text>
              {
        isSelected && (
        <Icon source={ImageResource.IC_Checked} tintColor={disabled ? 'gray' : undefined} />
        )
      }
          </Row>
      </TouchableOpacity>
  );
};
export default MemberItem;
