import React from 'react';
import styled from 'styled-components/native';
import NavigationService from '@NavigationService';
import _ from 'lodash';
import moment from 'moment';
import { StatusView, Text, Button, Icon, Linkages } from '@Elements';
import { HorizontalLine, Wrapper, VerticalLabelValue } from '../ItemCommon';
import { icons } from '../../../Resources/icon';
import LocaleConfig from '../../../Config/LocaleConfig';
import { Modules } from '../../../Config/Constants';

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

const ButtonLink = styled(Linkages)`
  margin-bottom: 12px;
`;

const ItemFB = ({ item, onPress, moduleId = Modules.FEEDBACK }) => {
  const { fullUnitCode, createdAt, commentBoxType, fullName, phoneNumber, emailAddress } = item;

  const onPressJR = (jrId) => {
    NavigationService.navigate('editJobRequest', {
      id: jrId,
    });
  };

  const onPressCreateJR = () => {
    let feedback = {
      parentId: item.id,
      moduleId,
      commentBoxDivisionId: item.commentBoxDivisionId,
    };
    if (moduleId === Modules.FEEDBACK) {
      feedback = {
        ...feedback,
        contactName: fullName,
        contactPhone: phoneNumber,
        contactEmail: emailAddress,
        unit: {
          unitId: item.unitId,
          fullUnitCode: item.fullUnitCode,
        },
      };
    }
    NavigationService.navigate('addJobRequest', {
      feedback,
    });
  };
  return (
    <Wrapper onPress={onPress}>
      <RowWrapper>
        <ID text={`#${item.id}`} preset="bold" />
        <Button onPress={onPressCreateJR}>
          <Icon source={icons.meterReading} size={15} />
        </Button>
      </RowWrapper>
      <HorizontalLine />
      <UserNameUnitWrapper>
        <RowWrapper>
          <Symbol resizeMode="contain" source={icons.user} />
          <UserName text={fullName} preset="medium" />
        </RowWrapper>
        {fullUnitCode && (
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
      <RowWrapper>
        <Symbol resizeMode="contain" source={icons.category} />
        <LeftValue text={commentBoxType?.name} preset="medium" />
      </RowWrapper>
      <RowWrapper>
        {createdAt && (
          <VerticalLabelValue
            label="COMMON_CREATION_TIME"
            value={moment(createdAt).format(LocaleConfig.dateTimeFormat)}
          />
        )}
      </RowWrapper>
      <ButtonLink
        linkages={item?.workOrderIds.map((id) => ({
          id,
        }))}
        text="JR_LINKAGE"
        onPress={(linkage) => onPressJR(linkage.id)}
      />

      <StatusView status={item.commentBoxStatus} />
    </Wrapper>
  );
};

export default ItemFB;
