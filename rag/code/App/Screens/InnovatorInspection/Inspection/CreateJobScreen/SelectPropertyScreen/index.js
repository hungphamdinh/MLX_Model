import React, { useState } from 'react';
import { DropdownItem } from '@Elements/Dropdown';
import useProperty from '@Context/Property/Hooks/UseProperty';
import AppList from '@Components/Lists/AppList';
import _ from 'lodash';
import BaseLayout from '@Components/Layout/BaseLayout';
import { SearchBar } from '@Elements';
import useInspection from '@Context/Inspection/Hooks/UseInspection';
import useFeatureFlag from '@Context/useFeatureFlag';
import useWorkflow from '@Context/Workflow/Hooks/UseWorkflow';

import { icons } from '../../../../../Resources/icon';

export function transformPropertyName(item, isEnableLiveThere) {
  if (!item) {
    return '';
  }
  const address = [item.floor, item.unitNumber, item.building].filter(Boolean).join(' ');
  return !isEnableLiveThere ? item.name : `${item.name} ${item.street ? ` - ${item.street}, ${address}` : ''}`;
}

const PropertyScreen = ({ navigation }) => {
  const {
    property: { propertiesToSelect },
    getPropertiesToSelect,
    getDetailProperty,
  } = useProperty();

  const {
    workflow: { fields },
  } = useWorkflow();
  const inspectionPropertyField =
    _.size(fields) && fields.properties.find((item) => item.propertyName === 'InspectionPropertyId');

  const {
    inspection: { inspectionSetting },
  } = useInspection();
  const { isCreatorAutoAssignmentOff, isShowGeneralInformation } = inspectionSetting;

  const { isEnableLiveThere } = useFeatureFlag();

  const { data, isLoadMore, isRefresh, currentPage, totalPage } = propertiesToSelect;
  const [keyword, setKeyword] = useState('');

  React.useEffect(() => {
    getList(1);
  }, [keyword]);

  const getList = (page = 1, text = keyword) => {
    const params = {
      page,
      keyword: text,
    };
    getPropertiesToSelect(params);
  };

  const onSearch = (text) => {
    setKeyword(text);
  };

  const onItemPress = async (item) => {
    const selectedProperty = await getDetailProperty(item.id);
    if (isShowGeneralInformation || isCreatorAutoAssignmentOff) {
      navigation.navigate('generalInfo', { selectedProperty });
      return;
    }
    navigation.navigate('selectFormToCreate', {
      selectedProperty,
      generalInfo: {},
    });
  };

  const listProps = {
    data,
    isRefresh,
    isLoadMore,
    currentPage,
    totalPage,
    loadData: getPropertiesToSelect,
    renderItem: ({ item }) => {
      item.label = transformPropertyName(item, isEnableLiveThere);
      return <DropdownItem style={{ flex: 0 }} item={item} onItemPress={onItemPress} />;
    },
    keyExtractor: (item) => `${item.id}`,
  };

  const onSkip = () => {
    navigation.navigate('selectFormToCreate', {
      selectedProperty: null,
      generalInfo: {},
    });
  };

  const mainLayoutProps = {
    onBtAddPress: () => {
      navigation.navigate('addProperty', {
        isCreateNewInspection: true,
      });
    },
    addPermission: 'InspectionProperty.Create',
    showAddButton: true,
    showBackButton: true,
    title: 'INSPECTION_SELECT_PROPERTY',
    leftIcon: icons.back,
    onLeftPress: () => {
      navigation.pop();
    },
    rightBtn: !inspectionPropertyField?.isRequired &&
      !isCreatorAutoAssignmentOff && {
        icon: icons.doubleArrow,
        onPress: onSkip,
      },
  };

  return (
    <BaseLayout {...mainLayoutProps}>
      <SearchBar placeholder="PROPERTY_SEARCH" onSearch={onSearch} />
      <AppList {...listProps} />
    </BaseLayout>
  );
};

export default PropertyScreen;
