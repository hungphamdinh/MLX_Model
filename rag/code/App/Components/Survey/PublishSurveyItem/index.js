import React from 'react';
import styled from 'styled-components/native';
import I18n from '@I18n';

import IconAndLabelItem from '../IconAndLabelItem';
import Tag from '../../ListItem/Tag';
import LabelValue from '../../ListItem/LabelValue';
import { HorizontalLine, ID, Wrapper } from '../../ItemApp/ItemCommon';

const TagWrapper = styled.View`
  flex-direction: row;
  margin-bottom: 16px;
`;

export const PublishSurveyToUnitItem = ({ item: { fullUnitCode }, id }) => (
  <Wrapper>
    <TagWrapper>
      <Tag color="#BCC3D3" name={`#${id}`} />
    </TagWrapper>
    <LabelValue label={I18n.t('COMMON_FULL_UNIT_CODE')} value={fullUnitCode} noMargin />
  </Wrapper>
);

export const PublishSurveyToTenantItem = ({ item: { displayName, emailAddress }, id }) => (
  <Wrapper>
    <ID text={`#${id}`} preset="bold" />
    <HorizontalLine />
    <IconAndLabelItem iconName="person" label={displayName} />
    <IconAndLabelItem iconName="mail" label={emailAddress} noMargin />
  </Wrapper>
);

export const PublishSurveyToEmployeeItem = (restProps) => <PublishSurveyToTenantItem {...restProps} />;
