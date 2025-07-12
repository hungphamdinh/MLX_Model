import React from 'react';
import I18n from '@I18n';
import BaseLayout from '@Components/Layout/BaseLayout';
import useProperty from '../../../../Context/Property/Hooks/UseProperty';
import LoaderContainer from '../../../../Components/Layout/LoaderContainer';
import FormLoadingLoading from '../../../../Components/Lists/Loaders/FormLoadingLoading';
import { PropertyInfoView } from '../../../../Components/InnovatorInspection/PropertyInfoModal';
import { isGranted } from '../../../../Config/PermissionConfig';
import useInspection from '../../../../Context/Inspection/Hooks/UseInspection';

const PropertyDetailScreen = ({ navigation }) => {
  const {
    property: { propertyDetail },
    isLoading,
    clearPropertyDetailData,
  } = useProperty();

  const {
    inspection: { inspectionSetting },
  } = useInspection();

  React.useEffect(
    () => () => {
      clearPropertyDetailData();
    },
    []
  );

  const onEditPropertyPress = () => {
    navigation.navigate('updateProperty');
  };

  const onStartInspection = () => {
    if (inspectionSetting?.isShowGeneralInformation) {
      navigation.navigate('generalInfo', {
        selectedProperty: propertyDetail,
      });
      return;
    }

    navigation.navigate('selectFormToCreate', {
      selectedProperty: propertyDetail,
      generalInfo: {},
    });
  };

  const onViewInspections = () => {
    navigation.navigate('inspectionList', { propertyId: propertyDetail.id, isOnline: true });
  };

  const bottomButtons = [
    {
      title: 'INSPECTION_VIEW_INSPECTIONS',
      type: 'info',
      onPress: onViewInspections,
    },
  ];
  if (propertyDetail.isActive) {
    bottomButtons.push({
      title: 'INSPECTION_START_INSPECTION',
      type: 'primary',
      onPress: onStartInspection,
      permission: 'Inspection.Create',
    });
  }

  const mainLayoutProps = {
    title: I18n.t('INSPECTION_PROPERTY_DETAIL'),
    rightBtn: isGranted('InspectionProperty.Update') &&
      propertyDetail.isActive && {
        title: I18n.t('COMMON_EDIT'),
        onPress: () => {
          onEditPropertyPress();
        },
      },
    bottomButtons,
  };

  return (
    <BaseLayout {...mainLayoutProps}>
      <LoaderContainer isLoading={isLoading} loadingComponent={<FormLoadingLoading />}>
        <PropertyInfoView propertyDetail={propertyDetail} />
      </LoaderContainer>
    </BaseLayout>
  );
};

export default PropertyDetailScreen;
