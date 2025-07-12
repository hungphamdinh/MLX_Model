import React, { Fragment, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { ImageResource } from '@Themes';
import { Icon, Text } from '@Elements';
import styled from 'styled-components/native';
import Row from '../../Grid/Row';
import { Wrapper } from '../../ItemApp/ItemCommon';

const ParentWrapper = styled.View`
  padding: 15px;
`;

const DropdownWithChildItem = ({
  item,
  onItemPress,
  isSelected,
  disabled,
  fieldName = 'name',
  values,
  valKey = 'id',
}) => {
  const childs = item.childs;

  const onChildPress = (child) => {
    onItemPress(child);
  };

  const isChildSelected = (child) => values.findIndex((val) => val[valKey] === child.id) > -1;

  return (
    <Fragment>
      {childs.length === 0 ? (
        <Wrapper onPress={() => onItemPress(item)} disabled={disabled}>
          <Row style={styles.itemTitle} center>
            <Row style={styles.itemTitle}>
              <Text>{item[fieldName] || item.label}</Text>
            </Row>
            {isSelected && <Icon source={ImageResource.IC_Checked} tintColor={disabled ? 'gray' : undefined} />}
          </Row>
        </Wrapper>
      ) : (
        <ParentWrapper>
          <Text style={styles.textParent} text={(item[fieldName] || item.label)?.toUpperCase()} />
          {childs.map((child, index) => (
            <ChildItem
              key={index.toString()}
              isSelected={isChildSelected(child)}
              item={child}
              onChildPress={onChildPress}
            />
          ))}
        </ParentWrapper>
      )}
    </Fragment>
  );
};

const ChildItem = ({ onChildPress, disabled, item, isSelected }) =>
  useMemo(
    () => (
      <Wrapper
        onPress={() => {
          onChildPress(item);
        }}
        disabled={disabled}
      >
        <Row style={styles.itemTitle} center>
          <Row style={styles.itemTitle}>
            <Text>{item.name}</Text>
          </Row>
          {isSelected && <Icon source={ImageResource.IC_Checked} tintColor={disabled ? 'gray' : undefined} />}
        </Row>
      </Wrapper>
    ),
    [isSelected]
  );

export default DropdownWithChildItem;

const styles = StyleSheet.create({
  itemTitle: {
    flex: 1,
  },
  icon: {
    marginRight: 8,
  },
  textParent: { marginBottom: 15 },
});
