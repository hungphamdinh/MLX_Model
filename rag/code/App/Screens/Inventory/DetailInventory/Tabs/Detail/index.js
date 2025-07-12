import React from 'react';
import styled from 'styled-components/native';
import _ from 'lodash';
import useInventory from '../../../../../Context/Inventory/Hooks/UseInventory';
import InfoText from '../../../../../Components/InfoText';

const Wrapper = styled.ScrollView`
  flex: 1;
`;

const InventoryDetailTab = () => {
  const {
    inventory: { inventoryDetail },
  } = useInventory();

  if (!inventoryDetail) {
    return null;
  }
  const {
    name,
    category,
    description,
    locationUseAt,
    typeDescription,
    minimumBalance,
    quantity,
    colourCode,
    rating,
    locationOther,
    locationRowNo,
    locationRackNo,
    location,
    itemCode,
    serialNumber,
  } = inventoryDetail;
  const categoryName = _.get(category, 'name');
  const locationName = _.get(location, 'name');
  return (
    <Wrapper contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 40 }}>
      <InfoText label="AD_IV_TITLE_NAME" value={name} />
      <InfoText label="AD_IV_ITEM_CODE" value={itemCode} />
      <InfoText label="AD_IV_TITLE_QUANTITY" value={quantity} />
      <InfoText label="AD_IV_CATEGORY" value={categoryName} />
      <InfoText label="AD_IV_DESCRIPTION" value={description} />
      <InfoText label="AD_IV_LOCATION_USE_AT" value={locationUseAt} />
      <InfoText label="AD_ASSETS_MINIMUM_BALANCE" value={minimumBalance} />
      <InfoText label="AD_ASSETS_LOCALTION" value={locationName} />
      <InfoText label="AD_ASSETS_RACK" value={locationRackNo} />
      <InfoText label="AD_ASSETS_LOCATION_ROW" value={locationRowNo} />
      <InfoText label="AD_ASSETS_LOCATION_OTHER" value={locationOther} />
      <InfoText label="AD_ASSETS_RATING" value={rating} />
      <InfoText label="AD_ASSETS_TYPE" value={typeDescription} />
      <InfoText label="AD_ASSETS_COLOR_CODE" value={colourCode} />
      <InfoText label="AD_ASSETS_SERIAL_NUMBER" value={serialNumber} />
    </Wrapper>
  );
};

export default InventoryDetailTab;
