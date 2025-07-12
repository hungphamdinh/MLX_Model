/* @flow */

import React from 'react';
import get from 'lodash/get';
import { Alert } from 'react-native';
import styled from 'styled-components/native';
import Swipeable from 'react-native-swipeable';
import { Text, StatusView } from '../../../Elements';
import { icons } from '../../../Resources/icon';
import { Wrapper, HorizontalLine, VerticalLabelValue } from '../../ItemApp/ItemCommon';
import RightButtons from '../../Lists/RightButtons';
import { generateGUID } from '../../../Utils/number';
import I18n from '../../../I18n';
import { PM_STATUS_ID } from '../../../Config/Constants';
import ListPlaceholder from '../../Lists/Placeholders/ListPlaceholder';
import useSync from '../../../Context/Sync/Hooks/UseSync';
import { formatDate } from '../../../Utils/transformData';
import Row from '../../Grid/Row';
import { map } from 'lodash';

const ID = styled(Text)`
  margin-bottom: 12px;
`;

const RowWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

const Header = styled(Row)`
  justify-content: space-between;
`;

const Symbol = styled.Image`
  width: 15px;
  height: 22px;
`;

const LeftValue = styled(Text)`
  margin-left: 12px;
  flex: 1;
`;

const UserName = styled(LeftValue)``;

const ItemPM = ({
  item,
  onPress,
  onViewInspection,
  onStartInspection,
  onCreateInspection,
  isPM,
  isUnSync,
  setIsUnSync,
  isHistory,
}) => {
  const [swipeRef, setSwipeRef] = React.useState(null);
  const teamUsers = map(item.users, (user) => user.displayName).join(', ') || '';
  const {
    sync: { unSyncDataInspections },
  } = useSync();

  React.useEffect(() => {
    if (isUnSync) {
      filterUnSyncInspection(unSyncDataInspections.data, item.inspectionsInProgress, item.inspectionsCompleted);
      setIsUnSync(false);
    }
  }, [isUnSync]);

  const { startDate, endDate, creationTime } = item;

  const recenter = () => {
    if (swipeRef) {
      swipeRef.recenter();
    }
  };
  const buttons = [];
  if (isPM) {
    const buttonCreate = {
      title: I18n.t('AD_PM_CREATE_INSPECTION'),
      color: '#2d61d3',
      onPress: () => {
        onCreateInspection();
      },
    };

    const buttonStart = {
      title: I18n.t('AD_PM_START_INSPECTION'),
      color: '#2d61d3',
      onPress: () => {
        onStartInspection(item.inspectionsInProgress);
      },
    };

    const buttonView = {
      title: I18n.t('AD_PM_VIEW_INSPECTION'),
      color: '#2d61d3',
      onPress: () => onViewInspection(item.inspectionsCompleted),
    };
    if (item.status?.id !== PM_STATUS_ID.CLOSED) {
      buttons.push(buttonCreate);
      if (item.inspectionsInProgress) {
        if (item.inspectionsInProgress.length > 0) {
          buttons.push(buttonStart);
        }
      }
    }
    if (item.inspectionsCompleted) {
      if (item.inspectionsCompleted.length > 0) {
        buttons.push(buttonView);
      }
    }
  }

  const filterUnSyncInspection = (syncs, inProgressInspection, closedInspection) => {
    syncs.forEach((itemSync) => {
      inProgressInspection.forEach((workflow) => {
        if (itemSync.remoteId === workflow.workflow.id) {
          workflow.workflow = itemSync;
          workflow.name = itemSync.subject;
          if (itemSync.status.isIssueClosed) {
            const removeIndex = inProgressInspection.map((child) => child.workflow.id).indexOf(itemSync.remoteId);
            inProgressInspection.splice(removeIndex, 1);
            closedInspection.push(itemSync);
          }
        }
      });
    });
  };

  const askIsPlanSeries = () => {
    Alert.alert(I18n.t(''), I18n.t('AD_PM_CHECK_SERIES_ASK'), [
      {
        text: I18n.t('AD_COMMON_CANCEL'),
        style: 'cancel',
      },
      {
        text: I18n.t('AD_PM_JUST_ONE_PLAN'),
        onPress: () => onPress(item),
      },
      {
        text: I18n.t('AD_PM_ENTIRE_SERIES'),
        onPress: () => onPress(item, true),
      },
    ]);
  };
  const rightButtons = [buttons].map((arr) => <RightButtons key={generateGUID()} onPress={recenter} buttons={arr} />);
  return (
    <Swipeable
      rightButtonWidth={140}
      rightButtons={rightButtons}
      onRef={(c) => {
        setSwipeRef(c);
      }}
    >
      {!item.isLoading ? (
        <Wrapper onPress={() => (!item.scheduleId ? onPress(item) : askIsPlanSeries())}>
          <Header>
            <ID text={`#${item.id}`} preset="bold" />
            {isHistory && <Text text={formatDate(creationTime)} />}
          </Header>

          <HorizontalLine />
          <RowWrapper>
            <Symbol resizeMode="contain" source={icons.user} />
            <UserName text={teamUsers} preset="medium" />
          </RowWrapper>
          <RowWrapper>
            <Symbol resizeMode="contain" source={icons.description} />
            <LeftValue text={`${item.description}`} preset="medium" />
          </RowWrapper>
          {!isHistory ? (
            (creationTime || startDate) && (
              <RowWrapper>
                {creationTime && <VerticalLabelValue label="COMMON_CREATED_DATE" value={formatDate(creationTime)} />}
                {startDate && <VerticalLabelValue label="PM_TARGET_EXECUTION_DATE" value={formatDate(startDate)} />}
              </RowWrapper>
            )
          ) : (
            <RowWrapper>
              {startDate && <VerticalLabelValue label="START_DATE" value={formatDate(startDate)} />}
              {endDate && <VerticalLabelValue label="END_DATE" value={formatDate(endDate)} />}
            </RowWrapper>
          )}

          <StatusView status={item.status || item.taskStatus} subStatus={item.priority} />
        </Wrapper>
      ) : (
        <ListPlaceholder isItem />
      )}
    </Swipeable>
  );
};

export default ItemPM;
