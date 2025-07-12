import React from 'react';
import styled from 'styled-components/native';
import { Text } from '@Elements';
import Row from '../../Grid/Row';
import StatisticItem from './StatisticItem';
import { Spacer } from '../../../Elements';

const Wrapper = styled.View`
  background-color: ${(props) => props.color};
  padding-horizontal: 15px;
  padding-vertical: 10px;
`;

const SectionWrapper = styled.View`
  margin-bottom: 10px;
  flex-direction: row;
  align-items: center;
`;

const Title = styled(Text)`
  margin-left: 8px;
  color: #000000;
  text-transform: capitalize;
`;

const Icon = styled.Image`
  width: 20px;
  height: 20px;
`;

const ModuleStatistic = ({ leftItem, rightItem, icon, title, color }) => (
  <Wrapper color={color}>
    <SectionWrapper>
      <Icon source={icon} resizeMode="contain" />
      <Title preset="bold" typo="H1" text={title} />
    </SectionWrapper>
    <Row>
      <StatisticItem {...leftItem} />
      <Spacer width={10} />
      <StatisticItem {...rightItem} />
    </Row>
  </Wrapper>
);

export default ModuleStatistic;
