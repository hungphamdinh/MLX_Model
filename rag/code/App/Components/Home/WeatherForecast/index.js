import React from 'react';
import styled from 'styled-components/native';
import I18n from '@I18n';
import _ from 'lodash';
import moment from 'moment';
import { Text } from '@Elements';
import { images } from '../../../Resources/image';
import WeatherDetailView from './WeatherDetailView';

const Wrapper = styled.View`
  margin-horizontal: 16px;
  border-radius: 5px;
  margin-bottom: 15px;
`;

const WeatherWrapper = styled.ImageBackground`
  margin-top: 16px;
  padding-vertical: 23px;
  padding-horizontal: 13px;
  background-color: #ffffff;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
`;

const Title = styled(Text)`
  color: #001335;
  text-transform: capitalize;
  margin-top: 16px;
`;

const TopWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const PlaceWrapper = styled.View`
  flex: 1;
`;

const BottomWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 25px;
`;

const Date = styled(Text)`
  font-size: 12px;
  color: #000000;
`;

const Location = styled(Text)`
  margin-top: 10px;
  color: #000000;
`;

const Temperature = styled(Text)`
  font-size: 35px;
  color: #000000;
  flex: 1;
  text-align: right;
`;

const WeatherIcon = styled.Image`
  height: 50px;
  width: 50px;
`;

const Dot = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: black;
  margin-horizontal: 16px;
`;

const defaultWeather = {
  current: {
    temp_c: 32, // Rounded and default temperature in Celsius
    feelslike_c: 39, // Feels like temperature in Celsius
    condition: {
      icon: '//cdn.weatherapi.com/weather/64x64/day/116.png', // Example icon URL
    },
  },
  forecast: {
    forecastday: [
      {
        astro: {
          sunset: '18:09', // Example sunset time
        },
        day: {
          avgtemp_c: 32, // Average temperature for the day
          condition: {
            icon: '//cdn.weatherapi.com/weather/64x64/day/116.png', // Example icon URL for the day
          },
        },
      },
    ],
  },
  location: {
    country: '',
    name: '',
  },
};

export function getWeatherIcon(weather, isNight) {
  const weatherCode = weather.code; //https://www.weatherapi.com/docs/weather_conditions.json

  switch (weatherCode) {
    case 1000: // Sunny
      return isNight ? images.weather01Night : images.weather01;

    case 1003: // Partly Cloudy
      return isNight ? images.weather02Night : images.weather02;

    case 1006: // Cloudy
      return images.weather03;

    case 1009: // Overcast
      return images.weather04;

    case 1063: // Patchy rain possible
    case 1069: // Patchy sleet possible
    case 1072: // Patchy freezing drizzle possible
    case 1150: // Patchy light drizzle
    case 1153: // Light drizzle
    case 1168: // Freezing drizzle
    case 1171: // Heavy freezing drizzle

    case 1180: // Patchy light rain
    case 1183: // Light rain
    case 1198: // Light freezing rain
    case 1186: // Moderate rain at times
    case 1189: // Moderate rain
    case 1192: // Heavy rain at times
    case 1195: // Heavy rain
    case 1201: // Moderate or heavy freezing rain
    case 1204: // Light sleet
    case 1207: // Moderate or heavy sleet
    case 1237: // Ice pellets
    case 1249: // Light sleet showers
    case 1252: // Moderate or heavy sleet showers
      return isNight ? images.weather10Night : images.weather10; // Rain

    case 1240: // Light rain shower
    case 1246: // Torrential rain shower
    case 1243: // Moderate or heavy rain shower
    case 1264: // Moderate or heavy showers of ice pellets
    case 1261: // Light showers of ice pellets
      return images.weather09; // Shower rain

    case 1087: // Thundery outbreaks possible
    case 1273: // Patchy light rain with thunder
    case 1276: // Moderate or heavy rain with thunder
      return images.weather11; // Thunderstorm

    case 1066: // Patchy snow
    case 1114: // BLowing snow
    case 1117: // Blizzard
    case 1210: // Patchy light snow
    case 1213: // Light snow
    case 1216: // Patchy moderate snow
    case 1219: // Moderate snow
    case 1222: // Patchy heavy snow
    case 1225: // Heavy snow
    case 1255: // Light snow showers
    case 1258: // Moderate or heavy snow showers
    case 1279: // Patchy light snow with thunder
    case 1282: // Moderate or heavy snow with thunder
      return images.weather13; // Snow

    case 1030: //mist
    case 1135: // Fog
    case 1147: // Freezing fog
      return images.weather50; // mist

    default:
      return images.weather03;
  }
}

// const weatherForecast = defaultWeather
const WeatherForecast = ({ weatherForecast = defaultWeather }) => {
  const DayByWeeks = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const now = moment();
  const currentDate = ` ${I18n.t(`HOME_WEATHER_${DayByWeeks[now.day()]}`)}, ${now.date()} ${I18n.t(
    `HOME_WEATHER_${MONTHS[now.month()]}`
  )}`;
  if (!weatherForecast) {
    return null;
  }

  const { current, forecast, location } = weatherForecast;

  if (!current && !forecast) {
    return null;
  }

  const celsius = Math.round(current?.temp_c);
  const feelLikeCelsius = Math.round(current?.feelslike_c);
  const forecastDay = forecast?.forecastday;
  const sunset = forecastDay ? _.first(forecastDay)?.astro?.sunset : '';

  const icon = getWeatherIcon(current?.condition);
  return (
    <Wrapper>
      <Title text="HOME_WEATHER_FORECAST" preset="bold" typo="H1" />
      <WeatherWrapper source={images.weatherCloudBackground}>
        <TopWrapper>
          <PlaceWrapper>
            <Date preset="bold" text={currentDate} />
            <Location text={`${location?.country}, ${location?.name}`} />
          </PlaceWrapper>
          <WeatherIcon source={icon} resizeMode="contain" />
          <Temperature text={`${celsius}°C`} />
        </TopWrapper>
        <BottomWrapper>
          <Text preset="medium" text={`${I18n.t('HOME_WEATHER_FEEL_LIKE')} ${feelLikeCelsius} °C`} />
          <Dot />
          <Text preset="medium" text={`${I18n.t('HOME_WEATHER_SUNSET')} ${sunset}`} />
        </BottomWrapper>
      </WeatherWrapper>
      <WeatherDetailView />
    </Wrapper>
  );
};

export default WeatherForecast;
