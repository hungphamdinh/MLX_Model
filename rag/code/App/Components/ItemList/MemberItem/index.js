import React from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import styles from './styles';
import { Icon, Text } from '../../../Elements';
import Row from '../../Grid/Row';
import { Fonts, ImageResource } from '../../../Themes';
import { Wrapper } from '../../ItemApp/ItemCommon';

const MemberItem = ({ item, onItemPress, isSelected, disabled, itemShowKey = 'name' }) => {
  const onPress = () => {
    onItemPress(item);
  };
  return (
    <Wrapper onPress={onPress} disabled={disabled}>
      <Row center>
        {<MaterialIcon name={item.icon} size={25} style={styles.icon} />}
        <Text fontFamily={Fonts.SemiBold} style={styles.itemTitle}>
          {item[itemShowKey]}
        </Text>
        {isSelected && <Icon source={ImageResource.IC_Checked} tintColor={disabled ? 'gray' : undefined} />}
      </Row>
    </Wrapper>
  );
};
export default MemberItem;
