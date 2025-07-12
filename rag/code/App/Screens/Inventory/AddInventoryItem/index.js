import React from 'react';
import I18n from '@I18n';
import BaseLayout from '@Components/Layout/BaseLayout';
import FormInventoryItem from '../FormInventoryItem';


const AddInventoryItem = ({ navigation }) => {
  const mainLayoutProps = {
    showBell: true,
    noPadding: true,
    title: I18n.t('IV_ADD_ITEM'),
    containerStyle: { paddingHorizontal: 15 },
  };


  return (
    <BaseLayout {...mainLayoutProps}>
      <FormInventoryItem navigation={navigation} />
    </BaseLayout>
  );
};

export default AddInventoryItem;
