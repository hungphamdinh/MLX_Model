import React from 'react';
import { StyleSheet } from 'react-native';
import { ImageResource } from '@Themes';
import { Icon, Text } from '@Elements';
import Row from '../../../Components/Grid/Row';
import { Wrapper } from '../../../Components/ItemApp/ItemCommon';
import { getItemIcon } from '../../../Elements/Dropdown';
import Tag from '../../Tag';

const DropdownItem = ({ item, onItemPress, isSelected, disabled, fieldName }) => (
  <Wrapper onPress={() => onItemPress(item)} disabled={disabled}>
    <Row style={styles.itemTitle} center>
      {getItemIcon(item.icon)}
      <Row style={styles.itemTitle}>
        <Text style={item.textAdditionStyle}>{item[fieldName] || item.label}</Text>
        {item.tagName && <Tag color={item.tagColor} style={{ marginLeft: 5 }} title={item.tagName} />}
      </Row>
      {isSelected && <Icon source={ImageResource.IC_Checked} tintColor={disabled ? 'gray' : undefined} />}
    </Row>
  </Wrapper>
);

export default DropdownItem;

const styles = StyleSheet.create({
  itemTitle: {
    flex: 1,
  },
  icon: {
    marginRight: 8,
  },
});
