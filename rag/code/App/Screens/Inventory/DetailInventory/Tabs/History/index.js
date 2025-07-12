import React from 'react';
import styled from 'styled-components/native';
import useInventory from '../../../../../Context/Inventory/Hooks/UseInventory';
import { icons } from '../../../../../Resources/icon';
import AppList from '../../../../../Components/Lists/AppList';
import ItemInventoryHistory from '../../../../../Components/ItemApp/ItemInventoryHistory';
import { PAGE_SIZE } from '../../../../../Config';

const Wrapper = styled.View`
  flex: 1;
`;

const InventoryHistoryTab = () => {
  const {
    inventory: { histories, inventoryDetail },
    getInventoryHistories,
  } = useInventory();

  React.useEffect(() => {
    if (inventoryDetail) {
      getList(1);
    }
  }, [inventoryDetail]);

  const { data, isRefresh, isLoadMore, currentPage, totalPage } = histories;

  const getList = (page) => {
    getInventoryHistories({
      page,
      inventoryIds: inventoryDetail.id,
      pageSize: PAGE_SIZE,
    });
  };

  const renderItem = (item) => <ItemInventoryHistory item={item} />;

  const listProps = {
    data,
    isRefresh,
    isLoadMore,
    currentPage,
    totalPage,
    iconName: icons.jobRequestEmpty,
    loadData: ({ page }) => getList(page),
    keyExtractor: (item) => item.id.toString(),
    renderItem: ({ item }) => renderItem(item),
  };

  if (!inventoryDetail) {
    return null;
  }

  return (
    <Wrapper>
      <AppList {...listProps} />
    </Wrapper>
  );
};

export default InventoryHistoryTab;
