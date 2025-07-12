import React from 'react';
import styled from 'styled-components/native';
import { Text } from '@Elements';
import _ from 'lodash';

import { Wrapper } from '../ItemCommon';
import { icons } from '../../../Resources/icon';
import { NextIcon } from '../../../Elements/statusView';
import { Metric } from '../../../Themes';
import { formatDateTime } from '../../../Utils/common';
import Tag from '../../Tag';
import Row from '../../Grid/Row';

const Header = styled(Row)`
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

const Symbol = styled.Image`
  width: 15px;
  height: 22px;
  margin-right: 5px;
`;

const Date = styled(Text)`
  margin-left: 12px;
`;

const DisplayItem = ({ value, icon }) => (
  <RowWrapper style={{ marginBottom: 0, maxWidth: Metric.ScreenWidth - 100 }}>
    {icon && <Symbol resizeMode="contain" source={icon} />}
    <Text numberOfLines={3} text={value} preset="medium" />
  </RowWrapper>
);

const ItemAsset = ({ item, onPress }) => {
  const { id, assetName, location, creationTime } = item;
  const createdDate = formatDateTime(creationTime);

  return (
    <Wrapper onPress={onPress}>
      <RowWrapper>
        <Header>
          <Text text={`#${id}`} preset="bold" />
          {_.size(item.referenceId) > 0 && <Tag containerStyle={{ marginLeft: 5 }} title="IMT" />}
        </Header>

        <Date text={createdDate} />
      </RowWrapper>
      <RowWrapper>
        <DisplayItem value={assetName} icon={icons.assetHome} />
      </RowWrapper>
      <SpaceBetweenRow style={{ marginBottom: 0 }}>
        <DisplayItem value={location} icon={icons.unit} />
        <NextIcon />
      </SpaceBetweenRow>
    </Wrapper>
  );
};

export default ItemAsset;
