// CalendarSelector.js
import React, { useMemo, useState, useCallback } from 'react';
import { Image, LayoutAnimation } from 'react-native';
import styled from 'styled-components/native';
import moment from 'moment';
import I18n from '@I18n';
import CalendarAgenda from './calendarAgenda';
import { Calendar } from './calendars';
import { icons } from '../../../Resources/icon';
import { useCommonFormController } from '../FormControl';

const Container = styled.View`
  background-color: white;
`;

const CalendarContainer = styled.View`
  background-color: white;
`;

const IconContainer = styled.View`
  align-self: center;
  margin-bottom: 10px;
`;

const CalendarButton = styled.TouchableOpacity``;

const CalendarIcon = styled(Image)`
  tint-color: black;
`;

const CalendarSelector = ({ selectedDate, onDayChange }) => {
  const [openFullCalendar, setOpenFullCalendar] = useState(false);

  const markDates = useMemo(() => (selectedDate ? [moment(selectedDate).format('YYYY-MM-DD')] : []), [selectedDate]);

  const dataSelected = useMemo(() => {
    const markedDateMap = {};
    markDates.forEach((item) => {
      markedDateMap[item] = {
        selected: true,
        selectedDotColor: 'orange',
        customStyles: {
          container: {
            backgroundColor: 'white',
            elevation: 2,
          },
          text: {
            color: '#4A89E8',
            fontWeight: 'bold',
          },
        },
      };
    });
    return markedDateMap;
  }, [markDates]);

  const onCalendarLayoutChange = useCallback((isOpen) => {
    setOpenFullCalendar(isOpen);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, []);

  const getDayArray = useMemo(() => I18n.t('EVENTS_TXT_WEEK').split(','), []);

  const handleDayPress = useCallback(
    (data) => {
      onDayChange(moment(data.dateString).toDate());
    },
    [onDayChange]
  );

  const handlePressDate = useCallback(
    (date) => {
      onDayChange(date);
    },
    [onDayChange]
  );

  return (
    <Container>
      {openFullCalendar ? (
        <CalendarContainer>
          <Calendar firstDay={1} minDate={new Date()} markedDates={dataSelected} onDayPress={handleDayPress} />
          <CalendarButton onPress={() => onCalendarLayoutChange(false)}>
            <IconContainer>
              <CalendarIcon source={icons.arrowCalendarUp} />
            </IconContainer>
          </CalendarButton>
        </CalendarContainer>
      ) : (
        <CalendarContainer>
          <CalendarAgenda
            selectedDate={selectedDate}
            onPressDate={handlePressDate}
            language={getDayArray}
            onPressGoToday={handlePressDate}
            onSwipeDown={() => onCalendarLayoutChange(true)}
            markedDate={[]}
          />
          <CalendarButton onPress={() => onCalendarLayoutChange(true)}>
            <IconContainer>
              <CalendarIcon source={icons.arrowCalendar} />
            </IconContainer>
          </CalendarButton>
        </CalendarContainer>
      )}
    </Container>
  );
};

const FormCalendarPicker = ({ name, label, required, ...props }) => {
  const { value, setFieldValue } = useCommonFormController(name);

  const onDayChange = useCallback(
    (date) => {
      setFieldValue(date);
    },
    [setFieldValue]
  );

  return <CalendarSelector onDayChange={onDayChange} selectedDate={value} {...props} />;
};

export default FormCalendarPicker;
