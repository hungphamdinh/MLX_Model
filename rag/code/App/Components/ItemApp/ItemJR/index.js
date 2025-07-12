import React, { useMemo } from 'react';
import styled from 'styled-components/native';
import NavigationService from '@NavigationService';
import _ from 'lodash';
import { TouchableOpacity } from 'react-native';
import { StatusView, Text, Image, Linkages } from '@Elements';
import moment from 'moment';
import { HorizontalLine, VerticalLabelValue, Wrapper } from '../ItemCommon';
import { icons } from '../../../Resources/icon';
import LocaleConfig from '../../../Config/LocaleConfig';
import { JR_STATUS_ID, Modules } from '../../../Config/Constants';
import { ImageResource, Colors } from '../../../Themes';
import useInspection from '../../../Context/Inspection/Hooks/UseInspection';
import I18n from '@I18n';

const ID = styled(Text)`
  font-size: 15px;
  flex: 1;
`;

const UserNameUnitWrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;

const RowWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
  flex: 1;
`;

const Symbol = styled.Image`
  width: 15px;
  height: 22px;
`;

const LeftValue = styled(Text)`
  margin-left: 12px;
  flex: 1;
`;

const UserName = styled(LeftValue)`
  margin-right: 5px;
`;

const Signature = styled(Image)`
  width: 18;
  height: 18;
`;

const Space = styled.View`
  margin-bottom: 10;
`;

const ItemJR = ({
  item,
  onPress,
  onPressSign,
  onPressPreview,
  isShowIRLinkage,
  isSorMode,
  isShowSignBtn = true,
  isShowActiveStatus = false,
  testID,
}) => {
  const { getInspectionFormDetailOnline } = useInspection();
  const { startDate, targetResponseDate, fullUnitCode, haveOfficeSigning, haveMaintenanceSigning, assets, location } =
    item;
  const userNames = _.map(item.users, (user) => user.displayName).join(', ') || _.get(item.creatorUser, 'displayName');
  const isShowSigningButton =
    isShowSignBtn && (item.statusId === JR_STATUS_ID.RESOLVED || item.statusId === JR_STATUS_ID.COMPLETED);

  const disabledSign = haveOfficeSigning && haveMaintenanceSigning;
  const getAssetNames = (jr) => _.map(jr.assets, (asset) => asset.assetName).join(', ');

  const activeStatus = item.isActive
    ? { colorCode: '#55E618', name: I18n.t('COMMON_ACTIVE') }
    : { colorCode: '#FF0101', name: I18n.t('COMMON_INACTIVE') };

  const onPressFBLinkage = ({ moduleId, parentId }) => {
    NavigationService.navigate(moduleId === Modules.FEEDBACK ? 'editFeedback' : 'editQRFeedback', {
      id: parentId,
    });
  };

  const onPressInspectionLinkage = (linkage) => {
    getInspectionFormDetailOnline({
      parentId: linkage.id,
    });
  };

  const assetLocationView = useMemo(() => {
    if (_.size(assets) || location) {
      return (
        <RowWrapper>
          {_.size(assets) > 0 && (
            <RowWrapper>
              <Symbol resizeMode="contain" source={icons.asset} />
              <LeftValue text={getAssetNames(item)} preset="medium" />
            </RowWrapper>
          )}
          {location && (
            <RowWrapper>
              <Symbol resizeMode="contain" source={icons.location} />
              <LeftValue text={location.name} preset="medium" />
            </RowWrapper>
          )}
        </RowWrapper>
      );
    }
    return null;
  }, [assets, location]);

  return (
    <Wrapper testID={testID || 'item-wrapper'} onPress={onPress}>
      <RowWrapper>
        <ID text={`#${item.id}`} preset="bold" />
        {isShowSigningButton ? (
          <>
            <TouchableOpacity testID="preview-button" style={{ marginRight: 5 }} onPress={onPressPreview}>
              <Signature tintColor={Colors.azure} source={icons.preview} />
            </TouchableOpacity>
            <TouchableOpacity testID="sign-button" disabled={disabledSign} onPress={onPressSign}>
              <Signature
                tintColor={!disabledSign ? Colors.azure : Colors.textSemiGray}
                source={ImageResource.signatureIcon}
              />
            </TouchableOpacity>
          </>
        ) : null}
        {item.isQuickCreate && <Symbol resizeMode="contain" source={icons.quickJR} />}
      </RowWrapper>
      <HorizontalLine />
      <UserNameUnitWrapper>
        <RowWrapper>
          <Symbol resizeMode="contain" source={icons.user} />
          <UserName text={userNames} preset="medium" />
        </RowWrapper>
        {_.size(fullUnitCode) > 0 && (
          <RowWrapper>
            <Symbol resizeMode="contain" source={icons.unit} />
            <UserName text={fullUnitCode} preset="medium" />
          </RowWrapper>
        )}
      </UserNameUnitWrapper>

      <RowWrapper>
        <Symbol resizeMode="contain" source={icons.description} />
        <LeftValue text={`${_.trim(item.description)}`} preset="medium" />
      </RowWrapper>
      {assetLocationView}
      {(startDate || targetResponseDate) && (
        <RowWrapper>
          {startDate && (
            <VerticalLabelValue
              label="COMMON_CREATION_TIME"
              value={moment(startDate).format(LocaleConfig.dateTimeFormat)}
            />
          )}
          {targetResponseDate && (
            <VerticalLabelValue
              label="JR_TARGET_RESPONSE_DATE"
              value={moment(targetResponseDate).format(LocaleConfig.dateTimeFormat)}
            />
          )}
        </RowWrapper>
      )}

      {item.parentId && (
        <Linkages text="FB_LINKAGE" linkages={[{ id: item.parentId }]} onPress={() => onPressFBLinkage(item)} />
      )}
      {item.inspectionId && (
        <Linkages text="INSPECTION_LINKAGE" linkages={[{ id: item.inspectionId }]} onPress={onPressInspectionLinkage} />
      )}
      {isShowIRLinkage && (
        <Linkages text={isSorMode ? 'SOR_REQUEST' : 'INVENTORY_REQUEST'} linkages={item.inventoryRequests} />
      )}
      <Space />
      <StatusView testID="statusView" status={item.status || item.taskStatus} subStatus={item.priority} />
      {isShowActiveStatus && <StatusView status={activeStatus} hideNextIcon />}
    </Wrapper>
  );
};

export default ItemJR;
