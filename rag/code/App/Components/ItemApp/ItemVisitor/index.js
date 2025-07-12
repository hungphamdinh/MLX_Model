import React from 'react';
import styled from 'styled-components/native';
import I18n from '@I18n';
import _ from 'lodash';
import { Text } from '@Elements';
import moment from 'moment';
import { HorizontalLine, VerticalLabelValue, Wrapper } from '../ItemCommon';
import { icons } from '../../../Resources/icon';
import LocaleConfig from '../../../Config/LocaleConfig';
import { Colors } from '../../../Themes';
import { NextIcon } from '../../../Elements/statusView';
import { formatDateTime } from '../../../Utils/common';
import { getCompanyRepresentativeName } from '../../../Utils/common';
import { View } from 'react-native';

const ID = styled(Text)`
  flex: 1;
`;

const RowWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

const SpaceBetweenRow = styled(RowWrapper)`
  justify-content: space-between;
`;

const CheckInOutWrapper = styled.View`
  flex-direction: row;
  margin-bottom: 15px;
`;

const UserWrapper = styled.View`
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 10px;
`;

const SensitiveWrapper = styled.View`
  align-items: flex-end;
`;

const Symbol = styled.Image`
  width: 15px;
  height: 22px;
  margin-right: 5px;
`;

const Column = styled.View`
  flex: 1;
  margin-left: 20px;
`;

const HeightSpace = styled.View`
  margin-top: 15px;
`;

const SubHeader = styled(Text)`
  flex: 1;
  margin-bottom: 10px;
  color: #757575;
`;

const RegisterLabel = styled(Text)`
  color: ${Colors.gray};
`;

const Date = styled(Text)`
  margin-left: 12px;
`;

const LabelValue = (props) => {
  if (_.size(props.value) === 0) {
    return null;
  }
  return <VerticalLabelValue style={{ marginBottom: 10 }} {...props} />;
};

const DisplayItem = ({ value, icon }) => {
  if (!value) {
    return null;
  }
  return (
    <RowWrapper style={{ marginBottom: 0, flex: 1, marginRight: 20 }}>
      {icon && <Symbol resizeMode="contain" source={icon} />}
      <Text text={value} preset="medium" />
    </RowWrapper>
  );
};

const ItemVisitor = ({ item, onPress }) => {
  const { createdAt, company } = item;
  const createdDate = formatDateTime(createdAt);
  const registerTime = formatDateTime(item.registerTime);
  const registerCheckOutTime = formatDateTime(item.registerCheckOutTime);
  const companyRepresentative = getCompanyRepresentativeName(company);
  return (
    <Wrapper onPress={onPress} testID="wrapper">
      <RowWrapper>
        <ID text={`#${item.code}`} preset="bold" />
        <Date text={createdDate} />
      </RowWrapper>
      <RowWrapper>
        <DisplayItem value={`${item.numberOfVisitors} ${I18n.t('VISITORS')}`} icon={icons.user} />
        <Text text={item.reasonForVisit?.name} />
      </RowWrapper>
      <SpaceBetweenRow style={{ marginBottom: 0 }}>
        <View>
          {item.location ? (
            <DisplayItem value={item.location.name} icon={icons.location} />
          ) : (
            <View>
              {item.fullUnitId && <DisplayItem value={item.fullUnitId} icon={icons.unit} />}
              {company && <DisplayItem value={companyRepresentative} icon={icons.company} />}
            </View>
          )}
        </View>
        <NextIcon />
      </SpaceBetweenRow>

      {(_.size(registerTime) > 0 || _.size(registerCheckOutTime) > 0) && (
        <>
          <HorizontalLine style={{ marginTop: 10 }} />
          <SpaceBetweenRow>
            <RegisterLabel text="VISITOR_CHECK_IN_OUT" />
          </SpaceBetweenRow>
          <SpaceBetweenRow style={{ marginBottom: 0 }}>
            <DisplayItem value={registerTime} icon={icons.checkIn} />
            <DisplayItem value={registerCheckOutTime} icon={icons.checkOut} />
          </SpaceBetweenRow>
        </>
      )}
    </Wrapper>
  );
};

export const ItemVisitorDetail = ({ item }) => {
  const { createdAt, company } = item;
  const createdDate = moment(createdAt).format(LocaleConfig.fullDateTimeFormat);
  const registerTime = formatDateTime(item.registerTime);
  const registerCheckOutTime = formatDateTime(item.registerCheckOutTime);
  const visitorInfoText = `${I18n.t('VISITOR_INFORMATION')} (${item.numberOfVisitors} ${I18n.t('VISITORS')})`;
  const companyRepresentative = getCompanyRepresentativeName(company);
  const isShowCheckInOutTime =
    _.size(registerTime) > 0 ||
    _.size(registerCheckOutTime) > 0 ||
    _.size(item.checkInTimes) > 0 ||
    _.size(item.checkOutTimes) > 0;

  return (
    <Wrapper>
      <RowWrapper>
        <ID text={`#${item.code}`} preset="bold" />
        <Date text={createdDate} />
      </RowWrapper>
      <SpaceBetweenRow>
        <View>
          {item.location ? (
            <DisplayItem value={item.location.name} icon={icons.location} />
          ) : (
            <View>
              {item.fullUnitId && <DisplayItem value={item.fullUnitId} icon={icons.unit} />}
              {company && <DisplayItem value={companyRepresentative} icon={icons.company} />}
            </View>
          )}
        </View>
        <Text text={item.username} preset="medium" />
      </SpaceBetweenRow>
      <HorizontalLine />
      <SubHeader text={visitorInfoText} preset="medium" />
      {item.visitorInformations.map((user) => (
        <UserWrapper key={user.id} testID="user-wrapper">
          <DisplayItem value={user.name || ' '} icon={icons.user} />
          <SensitiveWrapper>
            {_.size(_.trim(user.phone)) > 0 && <Text text={user.phone} />}
            {_.size(user.identityCardNumber) > 0 && <Text text={`****${user.identityCardNumber}`} />}
          </SensitiveWrapper>
        </UserWrapper>
      ))}

      <HorizontalLine />
      <LabelValue label="VISITOR_PURPOSE_OF_VISIT" value={item.reasonForVisit?.name} />
      <LabelValue label="COMMON_DESCRIPTION" value={item.description} />
      {isShowCheckInOutTime && <HorizontalLine />}
      {(_.size(registerTime) > 0 || _.size(registerCheckOutTime) > 0) && (
        <CheckInOutWrapper>
          <SubHeader text="VISITOR_CHECK_IN_OUT" preset="medium" />
          <Column>
            <DisplayItem value={registerTime} icon={icons.checkIn} />
            <DisplayItem value={registerCheckOutTime} icon={icons.checkOut} />
          </Column>
        </CheckInOutWrapper>
      )}
      {(_.size(item.checkInTimes) > 0 || _.size(item.checkOutTimes) > 0) && (
        <CheckInOutWrapper>
          <SubHeader text="VISITOR_ACTUAL_CHECK_IN_OUT" preset="medium" />
          <Column>
            {_.map(item.checkInTimes, (checkIn) => (
              <DisplayItem key={item.id} value={formatDateTime(checkIn.value)} icon={icons.checkIn} />
            ))}
            <HeightSpace />
            {_.map(item.checkOutTimes, (checkOut) => (
              <DisplayItem key={item.id} value={formatDateTime(checkOut.value)} icon={icons.checkOut} />
            ))}
          </Column>
        </CheckInOutWrapper>
      )}
    </Wrapper>
  );
};

export default ItemVisitor;
