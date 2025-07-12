import React from 'react';
import I18n from '@I18n';
import styled from 'styled-components/native';
import { Text } from '@Elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NavigationService from '@NavigationService';

import BaseLayout from '../../../Components/Layout/BaseLayout';
import TabView from '../../../Components/TabView';
import InventoryHistoryTab from './Tabs/History';
import { Colors } from '../../../Themes';
import FormInventoryItem from '../FormInventoryItem';

const StockButton = styled.TouchableOpacity`
  position: absolute;
  flex-direction: row;
  align-items: center;
  bottom: 45px;
  right: 15px;
  background-color: #648fca;
  height: 30px;
  border-radius: 15px;
  padding-horizontal: 15px;
`;

const Title = styled(Text)`
  color: white;
  font-size: 12px;
  margin-right: 7px;
`;

const IconWrapper = styled.View`
  width: 15px;
  height: 15px;
  border-radius: 7.5px;
  background-color: white;
  justify-content: center;
  align-items: center;
`;

const DetailWrapper = styled.View`
  padding-horizontal: 15px;
`;

const InventoryDetail = ({ navigation }) => {
  const onStockPress = () => {
    NavigationService.navigate('addInventoryStock');
  };

  return (
    <BaseLayout title="AD_IV_TITLE_HEADER" showBell={false}>
      <TabView>
        <DetailWrapper tabLabel={I18n.t('AD_IV_TAB_DETAIL')}>
          <FormInventoryItem navigation={navigation} />
        </DetailWrapper>
        <InventoryHistoryTab tabLabel={I18n.t('AD_HISTORY_TAB_LIST')} />
      </TabView>

      <StockButton onPress={onStockPress}>
        <Title text="IV_STOCK_IN_OUT" />
        <IconWrapper>
          <Icon name="chevron-double-right" color={Colors.azure} />
        </IconWrapper>
      </StockButton>
    </BaseLayout>
  );
};

export default InventoryDetail;
