import React from 'react';
import styled from 'styled-components/native';
import { Text } from '@Elements';
import ShadowView from '@Elements/ShadowView';
import { images } from '../../../Resources/image';
import Row from '../../Grid/Row';
// import ShadowView from '../../../Elements/ShadowView';
// import { ShadowView } from '../../../Elements';

const Wrapper = styled(ShadowView)`
  background-color: #ffffff;
  width: 70px;
  border-radius: 5px;
  padding-left: 10px;
  padding-bottom: 4px;
  margin: 10px;
`;

const WeatherWrapper = styled.View`
  align-items: flex-end;
`;

const WeatherIcon = styled.Image`
  height: 25px;
  width: 25px;
  right: 4px;
  margin-top: 4px;
`;

const Hour = styled(Text)`
  font-size: 11px;
  color: #000000;
`;

const Temperature = styled(Text)`
  font-size: 18px;
  color: #000000;
`;

const WeatherItem = ({ icon = defaultWeatherIcon, hour, celsius }) => (
  <Wrapper>
    <WeatherWrapper>
      <WeatherIcon source={icon} resizeMode="contain" />
    </WeatherWrapper>
    <Hour text={hour} />
    <Row>
      <Temperature preset="medium" text={`${celsius}`} />
      <Text text="°C" />
    </Row>
  </Wrapper>
);

export default WeatherItem;
