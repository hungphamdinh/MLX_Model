import React from 'react';
import styled from 'styled-components/native';
import _ from 'lodash';
import { StatusView, Text } from '@Elements';
import { HorizontalLine, VerticalLabelValue, Wrapper } from '../ItemCommon';
import { icons } from '../../../Resources/icon';
import { Colors } from '../../../Themes';
import { formatDate } from '../../../Utils/transformData';

const ID = styled(Text)`
  font-size: 15px;
  flex: 1;
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

const ContentWithIcon = ({ source, text }) => (
  <RowWrapper>
    <Symbol style={{ tintColor: Colors.text }} resizeMode="contain" source={source} />
    <LeftValue numberOfLines={2} text={text} preset="medium" />
  </RowWrapper>
);

const isCreatorAlsoAssignee = (item) => _.some(item.listAssigned, (assignee) => assignee.id === item?.creatorUser?.id);

const ItemInspectionHistory = ({ item, onPress }) => {
  const { listAssigned, team, workflow } = item;
  if (!workflow) {
    return null;
  }

  const { subject, status, startDate, form, creationTime, creatorUser } = workflow;
  const renderAssigneeInfo = () => {
    if (!team) {
      const userNames = [];

      // Add Creator User if Exists and Not Also an Assignee
      if (creatorUser && !isCreatorAlsoAssignee(item)) {
        userNames.push(creatorUser.displayName);
      }

      if (listAssigned && listAssigned.length > 0) {
        listAssigned.forEach((assignedUser) => {
          userNames.push(assignedUser.displayName);
        });
      }

      if (userNames.length === 0) return null;

      const displayNames = userNames.join(', ');

      return <ContentWithIcon text={displayNames} source={icons.user} />;
    }
    return <ContentWithIcon text={team?.name} source={icons.groupUser} />;
  };

  return (
    <Wrapper testID="item-wrapper" onPress={onPress}>
      <RowWrapper>
        <ID text={`#${item.id}`} preset="bold" />
      </RowWrapper>
      <HorizontalLine />
      <ContentWithIcon source={icons.form} text={`${subject}${form?.formName ? ` - ${form?.formName}` : ''}`} />
      {renderAssigneeInfo()}
      <ContentWithIcon source={icons.property} text={item.inspectionProperty?.name} />
      <RowWrapper>
        {creationTime && <VerticalLabelValue label="COMMON_CREATION_TIME" value={formatDate(creationTime)} />}
        {startDate && <VerticalLabelValue label="START_DATE" value={formatDate(startDate)} />}
      </RowWrapper>
      <StatusView testID="statusView" status={status} />
    </Wrapper>
  );
};

export default ItemInspectionHistory;
