import React from 'react';
import { Alert } from 'react-native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '@Themes';
import { Text } from '../../../../../../Elements';

const ItemWrapper = styled.TouchableOpacity`
  background-color: ${Colors.azure};
  align-items: center;
  border-radius: 20px;
  padding: 5px;
  margin-bottom: 10px;
  max-width: 150px;
  margin-horizontal: 5px;
`;

const Button = styled.TouchableOpacity`
  position: absolute;
  height: 20px;
  width: 20px;
  top: -10px;
  right: -10px;
  border-color: white;
  border-radius: 20px;
  border-width: 0.5px;
  background-color: ${Colors.azure};
`;

const Image = styled(Icon)`
  margin-left: 2px;
  margin-top: 1px;
`;

const ItemUnitText = styled(Text)`
  color: white;
`;

const ItemBudgetCode = ({ item, onPressRemove }) => {
  const onPressItem = (data) => {
    Alert.alert('', data, [{ text: 'OK' }], { cancelable: false });
  };

  return (
    <ItemWrapper onPress={() => onPressItem(item)} key={item}>
      <Button>
        <Image testID="close-button" size={15} color="white" name="close" onPress={onPressRemove} />
      </Button>
      <ItemUnitText numberOfLines={1} text={item} />
    </ItemWrapper>
  );
};

export default ItemBudgetCode;
