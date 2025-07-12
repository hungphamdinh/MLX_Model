import React from 'react';
import NavigationService from '@NavigationService';
import AppList from '@Components/Lists/AppList';
import BaseLayout from '@Components/Layout/BaseLayout';
import useInspection from '@Context/Inspection/Hooks/UseInspection';
import { useRoute } from '@react-navigation/native';
import ItemDefect from '@Components/ItemApp/ItemDefect';

const DefectDetail = () => {
  const { params } = useRoute();
  const {
    getDefects,
    inspection: { defects },
  } = useInspection();

  React.useEffect(() => {
    getList();
  }, []);

  const getList = () => {
    getDefects({
      page: 1,
      id: params?.id,
    });
  };

  const onPressItem = (item) => {
    NavigationService.navigate('editJobRequestTask', {
      id: item.id,
    });
  };

  const listProps = {
    ...defects,
    isLoadMore: false,
    loadData: ({ page }) => getList(page),
    keyExtractor: (item) => item.id.toString(),
    renderItem: ({ item }) => <ItemDefect item={item} onPress={() => onPressItem(item)} />,
  };

  return (
    <BaseLayout title="INSPECTION_DEFECT_DETAIL">
      <AppList {...listProps} />
    </BaseLayout>
  );
};

export default DefectDetail;
