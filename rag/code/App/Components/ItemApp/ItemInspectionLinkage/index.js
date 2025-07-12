import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Text as RNText } from 'react-native';
import { Text, StatusView, IconButton } from '@Elements';
import { HorizontalLine } from '../ItemCommon';
import LocaleConfig from '../../../Config/LocaleConfig';
import { Colors } from '../../../Themes';
import LabelValue from '../../ListItem/LabelValue';
import { formatDate } from '../../../Utils/transformData';
import Row from '../../Grid/Row';
import I18n from '../../../I18n';
import useUser from '../../../Context/User/Hooks/UseUser';
import useSync from '../../../Context/Sync/Hooks/UseSync';

// const InfoWrapper = styled.View`
//   flex: 1;
// `;

const Header = styled(Row)`
  justify-content: space-between;
`;

const Title = styled(Text)`
  font-size: 14px;
  margin-bottom: 7px;
`;

const Wrapper = styled.View`
  background-color: white;
  padding: 15px;
  border-radius: 15px;
  border-width: 1px;
  border-color: ${Colors.border};
  margin-bottom: 20px;
`;

const ButtonText = styled(RNText)`
  color: ${({ disabled }) => (disabled ? Colors.disabled : Colors.azure)};
  font-style: italic;
  font-weight: bold;
`;

const RowWrapper = styled(Row)`
  margin-top: 10px;
  justify-content: space-between;
`;

const InspectionButton = ({ onPress, text, isSyncing }) => (
  <TouchableOpacity disabled={isSyncing} onPress={onPress}>
    <ButtonText disabled={isSyncing}>{I18n.t(text)}</ButtonText>
  </TouchableOpacity>
);

const ItemInspectionLinkage = ({ isClosed = false, item, onRemove, onViewReport, onExecute, onRelease }) => {
  const {
    user: { user },
  } = useUser();

  const {
    workflow,
    pickedByUser,
    pickedByUserId,
    workflow: { creatorUser },
  } = item;

  const {
    sync: { unSyncDataInspections },
  } = useSync();

  const color = workflow.status?.colorCode;
  const startDate = formatDate(workflow.startDate, LocaleConfig.fullDateTimeFormat);
  const endDate = formatDate(workflow.closedDate, LocaleConfig.fullDateTimeFormat);
  const statusName = workflow.status?.name;
  const isCreatorPicked = pickedByUserId === user?.id;
  const getSyncingItem = () => unSyncDataInspections.data.findIndex((inspection) => inspection.guid === workflow.guid) > -1;

  const isCompleted = workflow.status?.isIssueClosed;
  let isNotOwner = false;
  if (creatorUser) {
    isNotOwner = creatorUser.id !== user.id;
  }

  let textButton = '';
  if (!isCreatorPicked) {
    if (isCompleted) {
      textButton = 'INSPECTION_VIEW_REPORT';
    } else if (item.canStartInspection) {
      textButton = 'AD_PM_START_INSPECTION';
    }
  }

  return (
    <Wrapper>
      <Header>
        <Row center>
          <Title preset="bold" text={`${workflow.parentId} - ${workflow.subject}`} numberOfLines={2} />
        </Row>

        {!isCompleted && !isNotOwner ? (
          <IconButton
            name="close-circle-outline"
            color={Colors.gray}
            containerStyle={{ marginTop: -5, marginRight: -10 }}
            size={15}
            onPress={onRemove}
          />
        ) : null}
      </Header>

      <HorizontalLine />
      {startDate && <LabelValue label="COMMON_PLANNED_START_DATE" value={startDate} />}
      {endDate && <LabelValue label="COMMON_ACTUAL_COMPLETION_DATE" value={endDate} />}
      <LabelValue label="INSPECTION_PICKED_BY" value={pickedByUser?.displayName} />
      <StatusView
        hideNextIcon
        subComponent={
          isClosed && !isCompleted ? null : (
            <InspectionButton onPress={isCompleted ? onViewReport : onExecute} text={textButton} />
          )
        }
        status={{ colorCode: color, name: statusName }}
      />
      {isCreatorPicked && (
        <RowWrapper>
          <>
            <InspectionButton isSyncing={getSyncingItem()} onPress={onRelease} text="PM_INSPECTION_LINKAGE_RELEASE" />
            {!isCompleted ? (
              <InspectionButton onPress={onExecute} text="AD_PM_START_INSPECTION" />
            ) : (
              <InspectionButton onPress={onViewReport} text="INSPECTION_VIEW_REPORT" />
            )}
          </>
        </RowWrapper>
      )}
    </Wrapper>
  );
};

export default ItemInspectionLinkage;
