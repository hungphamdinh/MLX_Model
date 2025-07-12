import React from 'react';
import _ from 'lodash';
import { View } from 'react-native';
import I18n from '@I18n';
import styled from 'styled-components/native';
import { Text } from '@Elements';
import { PieChart } from 'react-native-svg-charts';
import Row from '../../Grid/Row';
import { LEGEND_COLORS } from '../../../Config/Constants';
import { Wrapper } from '../../ItemApp/ItemCommon';

const OptionWrapper = styled.View`
  margin-right: 16px;
  margin-bottom: 16px;
`;

const LegendWrapper = styled.View`
  flex-direction: row;
`;

const Legend = styled.View`
  width: 5px;
  background-color: ${(props) => props.color};
  margin-right: 10px;
`;

const OptionTotal = styled(Text)`
  text-align: center;
`;

const OptionAnswer = styled(Text)`
  text-align: center;
`;

const OptionPercentage = styled(Text)`
  text-align: center;
  margin-left: 15px;
  margin-top: 10px;
`;

const OptionItem = ({ value, name, percentage, legendColor }) => (
  <OptionWrapper>
    <LegendWrapper>
      <Legend color={legendColor} />
      <View>
        <OptionTotal>{value}</OptionTotal>
        <OptionAnswer preset="medium">{name}</OptionAnswer>
      </View>
    </LegendWrapper>
    <OptionPercentage>{percentage}%</OptionPercentage>
  </OptionWrapper>
);

const ChartWrapper = styled.View`
  align-items: center;
  margin-right: 20px;
`;

const AnswerSummaryWrapper = styled.View`
  flex-wrap: wrap;
  flex-direction: row;
  flex: 1;
`;

const Title = styled(Text)`
  font-weight: bold;
  margin-bottom: 16px;
`;

const Label = styled(Text)``;

const Pie = styled(PieChart)`
  height: 60px;
  width: 60px;
  margin-bottom: 16px;
`;

const SurveySummaryItem = ({ onPress, item: { data, question } }) => {
  const chartData = data.map((item) => item.value);
  const totalValue = _.sum(chartData);
  const pieData = chartData.map((value, index) => ({
    value,
    svg: {
      fill: LEGEND_COLORS[index],
      onPress: () => console.log('press', index),
    },
    key: `pie-${index}`,
  }));

  const getPercentage = (value) => {
    if (totalValue) {
      return parseFloat((value / totalValue) * 100).toFixed(0);
    }
    return 0;
  };

  return (
    <Wrapper onPress={onPress}>
      <Title preset="medium">{question.description}</Title>
      <Row>
        <ChartWrapper>
          <Pie data={pieData} />
          <Label>
            {I18n.t('SURVEY_TOTAL')}: {totalValue}
          </Label>
        </ChartWrapper>
        <AnswerSummaryWrapper>
          {data.map((item, index) => (
            <OptionItem
              key={item.name}
              {...item}
              percentage={getPercentage(item.value)}
              legendColor={LEGEND_COLORS[index]}
            />
          ))}
        </AnswerSummaryWrapper>
      </Row>
    </Wrapper>
  );
};

export default SurveySummaryItem;

SurveySummaryItem.defaultProps = {};
