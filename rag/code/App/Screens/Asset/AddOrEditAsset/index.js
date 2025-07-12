import React, { Fragment, useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { useRoute } from '@react-navigation/native';
import _ from 'lodash';
import useAsset from '@Context/Asset/Hooks/UseAsset';
import useUser from '@Context/User/Hooks/UseUser';
import { Colors } from '../../../Themes';
import BaseLayout from '../../../Components/Layout/BaseLayout';
import SegmentControl from '../../../Components/segmentControl';
import { Modules } from '../../../Config/Constants';
import MaintenancePlan from './MaintenancePlan';
import JobRequestHistory from './JobRequestHistory';
import DetailTab from './DetailTab';
import InspectionHistory from './InspectionHistory';

const SegmentWrapper = styled.View`
  background-color: ${Colors.bgWhite};
  padding: 10px;
  margin-top: -20px;
`;

const Wrapper = styled.View`
  flex: 1;
`;

const AddOrEditAsset = ({ navigation }) => {
  const route = useRoute();
  const [tabIndex, setTabIndex] = useState(0);
  const id = route.params?.id;
  const isAddNew = _.get(navigation, 'state.routeName') !== 'detailAssets';

  const {
    asset: { assetDetail },
    getAssetDetail,
    resetAssetDetail,
  } = useAsset();

  const { getEmployees } = useUser();
  const tabs = ['AD_ASSETS_TAB_DETAIL', 'PM_HISTORY', 'JR_HISTORY', 'AD_ASSETS_TAB_LIST', 'INSPECTION_HISTORY'];
  const otherModule = assetDetail?.moduleId;

  useEffect(() => {
    getEmployees();
    if (id) {
      getAssetDetail(id);
    }
    return () => {
      resetAssetDetail();
    };
  }, [id]);

  const tabValues = () => {
    if (isAddNew) {
      return tabs.filter((item) => item === 'AD_ASSETS_TAB_DETAIL');
    }
    if (otherModule === Modules.WORKORDER) {
      return tabs.filter((item) => ['JR_HISTORY', 'AD_ASSETS_TAB_DETAIL'].includes(item));
    }
    if (otherModule === Modules.PLANMAINTENANCE) {
      return tabs.filter((item) => ['AD_ASSETS_TAB_LIST', 'AD_ASSETS_TAB_DETAIL'].includes(item));
    }
    return tabs.filter((item) => item !== 'AD_ASSETS_TAB_LIST');
  };

  const getListFromOther = () => {
    if (otherModule === Modules.WORKORDER) {
      return <JobRequestHistory />;
    }
    return <MaintenancePlan navigation={navigation} />;
  };

  const getListFromAsset = () => {
    if (tabIndex === 2) {
      return <JobRequestHistory />;
    }
    if (tabIndex === 3) {
      return <InspectionHistory />;
    }
    return <MaintenancePlan isHistory navigation={navigation} />;
  };

  const onTabChange = (val) => {
    setTabIndex(val);
  };

  const getSegments = (child) => (
    <Fragment>
      <SegmentWrapper>
        <SegmentControl
          dynamicScrolling
          selectedIndex={tabIndex}
          values={tabValues()}
          onChange={onTabChange}
          overflow
          scrollEnabled
        />
      </SegmentWrapper>
      {child}
    </Fragment>
  );

  const showTab = () => {
    if (isAddNew) {
      return <DetailTab isAddNew={isAddNew} navigation={navigation} />;
    }

    let tab = null;
    if (tabIndex === 0) {
      tab = (
        <Wrapper>
          <DetailTab readOnly={!!otherModule} isAddNew={isAddNew} navigation={navigation} assetDetail={assetDetail} />
        </Wrapper>
      );
    } else if (otherModule) {
      tab = <Wrapper>{getListFromOther()}</Wrapper>;
    } else {
      tab = <Wrapper>{getListFromAsset()}</Wrapper>;
    }
    return getSegments(tab);
  };

  return <BaseLayout title={isAddNew ? 'ADD_ASSET' : 'AD_AS_DETAIL_ASSET_TITLE'}>{showTab()}</BaseLayout>;
};

export default AddOrEditAsset;
