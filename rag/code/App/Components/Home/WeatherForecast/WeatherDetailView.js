import React from 'react';
import styled from 'styled-components/native';
import moment from 'moment';
import { Text } from '@Elements';
import _ from 'lodash';
import WeatherItem from './WeatherItem';
import useHome from '../../../Context/Home/Hooks/UseHome';
import LocaleConfig from '../../../Config/LocaleConfig';
import { getWeatherIcon } from './index';
import ShadowView from '../../../Elements/ShadowView';

const Wrapper = styled(ShadowView)`
  background-color: #ffffff;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  padding-bottom: 4px;
  padding-top: 10px;
  elevation: 6;
`;

const WeatherSlide = styled.ScrollView``;

const DayOfWeekWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 5px;
  margin-left: 10px;
`;

const DayButtonWrapper = styled.TouchableOpacity`
  margin-right: 20px;
`;

const DayButtonTitle = styled(Text)`
  color: ${(props) => (props.isActive ? '#2B4593' : 'black')};
  font-size: 12px;
`;

const TextButton = ({ title, onPress, isActive }) => (
  <DayButtonWrapper onPress={onPress}>
    <DayButtonTitle preset="medium" isActive={isActive} text={title} />
  </DayButtonWrapper>
);

const WeatherDetailView = () => {
  const {
    home: { weatherForecast },
  } = useHome();
  const [dayIndex, setDayIndex] = React.useState(0);
  const dayButtons = ['COMMON_TODAY', 'COMMON_TOMORROW', 'HOME_WEATHER_NEXT_7_DAYS'];

  if (!weatherForecast) return null;

  const handleDayTypeChange = (index) => {
    setDayIndex(index);
  };

  const getWeatherDataByDayIndex = (forecastDay) => {
    if (dayIndex === 0) {
      const todayHour = _.first(forecastDay)?.hour;
      return _.filter(todayHour, (item) => weatherForecast.current.last_updated_epoch <= item.time_epoch); // start by current time
    }
    if (dayIndex === 1) return forecastDay[1]?.hour; // tomorrow
    return forecastDay;
  };

  const formatWeatherData = (item) => {
    const isNext7Days = dayIndex === 2;
    const day = moment.unix(isNext7Days ? item.date_epoch : item.time_epoch);
    const celsius = Math.round(isNext7Days ? item.day.avgtemp_c : item.temp_c);
    const time = day.format(isNext7Days ? dateFormat : timeFormat);
    const isNight = day.hour() >= 18 || day.hour() < 6;
    const icon = getWeatherIcon(isNext7Days ? item.day.condition : item?.condition, isNight);

    return { celsius, time, icon };
  };

  const forecastDay = weatherForecast.forecast?.forecastday || [];
  const weatherData = getWeatherDataByDayIndex(forecastDay);
  const dateFormat = LocaleConfig.dateTimeFormat.substr(0, 5) || 'MM/DD';
  const timeFormat = LocaleConfig.timeFormat;

  if (!weatherData) {
    return null;
  }

  return (
    <Wrapper>
      <DayOfWeekWrapper>
        {dayButtons.map((title, index) => (
          <TextButton
            key={title}
            title={title}
            isActive={index === dayIndex}
            onPress={() => handleDayTypeChange(index)}
          />
        ))}
      </DayOfWeekWrapper>
      <WeatherSlide horizontal showsHorizontalScrollIndicator={false}>
        {weatherData.map((item) => {
          const { celsius, time, icon } = formatWeatherData(item);
          return <WeatherItem key={item.dt || item.date_epoch} celsius={celsius} hour={time} icon={icon} />;
        })}
      </WeatherSlide>
    </Wrapper>
  );
};

export default WeatherDetailView;
