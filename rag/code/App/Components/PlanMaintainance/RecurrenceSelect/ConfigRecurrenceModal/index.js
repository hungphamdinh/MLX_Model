/* eslint-disable eqeqeq */
/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { Alert, Modal, View, SafeAreaView } from 'react-native';
import I18n from '@I18n';
import moment from 'moment';
import { FormProvider } from 'react-hook-form';
import Header from '../../../Header';
import { FormCheckBox, FormDate, FormDropdown, FormInput } from '../../../Forms';
import { Button, Icon, Text } from '../../../../Elements';
import { Colors } from '../../../../Themes';
import LocaleConfig from '../../../../Config/LocaleConfig';
import { Repeat } from '../../../../Config/Constants';
import AwareScrollView from '../../../Layout/AwareScrollView';

import { icons } from '../../../../Resources/icon';

import { useCompatibleForm } from '../../../../Utils/hook';

const Wrapper = styled.View`
  padding-horizontal: 16px;
  flex: 1;
  background-color: ${Colors.bgMain};
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const ItemRow = styled.View`
  width: 48%;
`;

const TextEvery = styled(Text)`
  position: absolute;
  top: 35px;
  right: 10px;
`;

const ConfigRecurrenceModal = ({ visible, onClose, onSubmitForm, schedule, onRemove }) => {
  const monthsTxt = I18n.t('BK_TXT_MONTH');
  const frequencyOptions = [
    {
      id: Repeat.daily,
      name: I18n.t('AD_PM_DAILY'),
    },
    {
      id: Repeat.weekly,
      name: I18n.t('AD_PM_WEEKLY'),
    },
    {
      id: Repeat.monthly,
      name: I18n.t('AD_PM_MONTHLY'),
    },
    {
      id: Repeat.yearly,
      name: I18n.t('AD_PM_YEARLY'),
    },
  ];

  const everyDailyTypes = ['AD_PM_RECURRENCE_DAY', 'AD_PM_RECURRENCE_WORKING_DAY'].map((item, index) => ({
    id: index + 1,
    label: I18n.t(item),
  }));

  const onTypes = ['DAY', 'FIRST', 'SECOND', 'THIRD', 'FOURTH', 'LAST'].map((item, index) => ({
    id: item,
    label: I18n.t(`COMMON_${item}`),
    code: item === 'LAST' ? 'L' : index.toString(),
  }));

  const monthOptions = monthsTxt.split(',').map((item, idx) => ({
    id: idx + 1,
    name: item,
  }));

  const dayOfWeeksOptions = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'].map(
    (item, idx) => ({
      id: idx + 1,
      name: I18n.t(`COMMON_${item}`),
      code: item.substring(0, 3).toUpperCase(),
    })
  );

  const defaultTime = new Date();
  defaultTime.setHours(9, 0, 0);

  const initialValues = {
    frequency: frequencyOptions[0],
    month: '',
    every: '1',
    dayOfWeeks: [],
    onType: everyDailyTypes[0],
    startAt: monthOptions[0],
    onDay: null,
    startTime: defaultTime,
    durations: 30,
    startDate: new Date(),
    endDate: undefined,
    isNearestWeekday: false,
  };
  const [isInitial, setIsInitial] = useState(false);

  const formMethods = useCompatibleForm({
    defaultValues: initialValues,
  });

  const { setFieldValue, handleSubmit, watch } = formMethods;

  const transformFromCronExpression = (input) => {
    const { startDate, endDate, cronExpression, startTime, durations } = input;
    const data = cronExpression.split(' ');
    const dayOfMonth = data[3] !== '?' ? data[3].substring(2, data[3].length) : data[3];
    const dayOfMonthNumber = data[3];
    const month = data[4];
    const dayOfWeek = data[5];

    const isNearestWeekday = dayOfMonthNumber.includes('W');
    let frequency = Repeat.daily;
    // month value null
    if (checkCronValueBlank(month)) {
      if (dayOfMonth !== '?' || dayOfWeek === 'MON-FRI') {
        frequency = Repeat.daily;
      } else {
        frequency = Repeat.weekly;
      }
    }
    // have month value
    else if (!checkCronValueBlank(month)) {
      if (month.includes('/')) {
        frequency = Repeat.monthly;
      } else {
        frequency = Repeat.yearly;
      }
    } else if (month.include('1/')) {
      frequency = Repeat.yearly;
    }

    let startAt = null;
    let every = dayOfMonth;
    if (frequency === Repeat.daily) {
      every = dayOfMonth;
      if (input.period) {
        every = input.period;
      }
    } else if (frequency === Repeat.weekly) {
      every = dayOfMonth;
    } else if (frequency === Repeat.monthly) {
      every = month.substring(month.indexOf('/') + 1, month.length);
      const startAtMonth = month.substring(0, month.indexOf('/'));
      startAt = monthOptions.filter((item) => item.id == startAtMonth)[0];
    } else {
      every = monthOptions.filter((item) => item.id == month)[0];
    }

    let onType = null;
    if (frequency === Repeat.daily) {
      if (dayOfWeek === 'MON-FRI') {
        onType = everyDailyTypes[1];
      } else {
        onType = everyDailyTypes[0];
      }
    } else if (frequency === Repeat.monthly) {
      if (dayOfMonth !== '?') {
        onType = onTypes[0];
      } else {
        const type = dayOfWeek.substring(dayOfWeek.indexOf('#') + 1, dayOfWeek.length);
        if (type.includes('L')) {
          onType = onTypes.filter((item) => item.code === 'L')[0];
        } else {
          onType = onTypes.filter((item) => item.code === type)[0];
        }
      }
    } else if (frequency === Repeat.yearly) {
      if (dayOfMonth !== '?') {
        onType = onTypes[0];
      } else {
        const type = dayOfWeek.substring(dayOfWeek.indexOf('#') + 1, dayOfWeek.length);
        if (type.includes('L')) {
          onType = onTypes.filter((item) => item.code === 'L')[0];
        } else {
          onType = onTypes.filter((item) => item.code === type)[0];
        }
      }
    }

    const dayOfWeeks = [];
    if (frequency === Repeat.weekly) {
      const dataDay = dayOfWeek.split(',');
      dayOfWeeksOptions.map((item) => {
        dataDay.map((day) => {
          if (item.code === day) {
            dayOfWeeks.push(item);
          }
        });
      });
    }

    let onDay = null;
    if (frequency === Repeat.monthly) {
      if (dayOfMonthNumber !== '?') {
        onDay = !isNearestWeekday
          ? { name: dayOfMonthNumber }
          : { name: dayOfMonthNumber.substring(0, dayOfMonthNumber.indexOf('W')) };
      } else {
        let type = '';
        if (dayOfWeek.includes('L')) {
          type = dayOfWeek.substring(0, dayOfWeek.indexOf('L'));
        } else {
          type = dayOfWeek.substring(0, dayOfWeek.indexOf('#'));
        }
        onDay = dayOfWeeksOptions.filter((item) => item.code === type)[0];
      }
    } else if (frequency === Repeat.yearly) {
      if (dayOfMonthNumber !== '?') {
        onDay = !isNearestWeekday
          ? { name: dayOfMonthNumber }
          : { name: dayOfMonthNumber.substring(0, dayOfMonthNumber.indexOf('W')) };
      } else {
        let type = '';
        if (dayOfWeek.includes('L')) {
          type = dayOfWeek.substring(0, dayOfWeek.indexOf('L'));
        } else {
          type = dayOfWeek.substring(0, dayOfWeek.indexOf('#'));
        }
        onDay = dayOfWeeksOptions.filter((item) => item.code === type)[0];
      }
    }

    return {
      frequency: frequencyOptions.filter((item) => item.id === frequency)[0],
      month: '',
      every,
      dayOfWeeks,
      onType,
      onDay,
      startTime: new Date(startTime),
      durations,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      startAt,
      isNearestWeekday,
    };
  };

  useEffect(() => {
    if (schedule && !isInitial) {
      const data = transformFromCronExpression({
        cronExpression: schedule.cronExpression ? schedule.cronExpression : '',
        startDate: schedule.startDate,
        endDate: schedule.endDate,
        startTime: schedule.startTime,
        durations: schedule.minuteDuration,
        period: schedule.period,
      });
      formMethods.reset(data);
      onSubmit(data, true);
      setIsInitial(true);
    }
  }, [schedule]);

  const renderLeft = () => (
    <Button
      onPress={onClose}
      style={{
        flex: 1,
        justifyContent: 'center',
        paddingLeft: 15,
      }}
    >
      <Icon source={icons.close} />
    </Button>
  );

  const transformToCronExpression = (input, type) => {
    let data = null;
    const { onDay, every, onType, dayOfWeeks, startAt, isNearestWeekday } = input;
    const startTime = moment(input.startTime).format(LocaleConfig.timeFormat);
    const indexOfStartTime = startTime.indexOf(':');
    const startHour = parseZeroTime(startTime.substring(0, indexOfStartTime));
    const startMinute = parseZeroTime(startTime.substring(indexOfStartTime + 1, indexOfStartTime + 3));
    const nearestWeekday = isNearestWeekday ? 'W' : '';
    let dayOfWeekStr = '';
    dayOfWeeks.map((item, index) => (dayOfWeekStr += index > 0 ? `,${item.code}` : item.code));

    const startDay = new Date(input.startDate).getDate();

    switch (type) {
      case Repeat.daily:
        data =
          onType.id === 1
            ? (data = `0 ${startMinute} ${startHour} ${startDay} * ? *`)
            : (data = `0 ${startMinute} ${startHour} ? * MON-FRI *`);
        break;
      case Repeat.weekly:
        data = `0 ${startMinute} ${startHour} ? * ${dayOfWeekStr} *`;
        break;
      case Repeat.monthly:
        data =
          onType.id === 'DAY'
            ? `0 ${startMinute} ${startHour} ${onDay.name}${nearestWeekday} 1/${every} ? *`
            : `0 ${startMinute} ${startHour} ? ${startAt?.id}/${every} ${onDay.code}${onType?.code === 'L' ? '' : '#'}${
                onType.code
              } *`;
        break;
      case Repeat.yearly:
        data =
          onType.id === 'DAY'
            ? `0 ${startMinute} ${startHour} ${onDay.name}${nearestWeekday} ${every.id} ? *`
            : `0 ${startMinute} ${startHour} ? ${every.id} ${onDay.code}${onType?.code === 'L' ? '' : '#'}${
                onType.code
              } *`;
        break;
      default:
    }
    return data;
  };

  const checkCronValueBlank = (val) => val === '*' || val === '0';

  const parseZeroTime = (str) => (str === '00' ? '0' : str);

  const onChangeFrequencyVal = (val) => {
    setFieldValue('every', '');
    if (val.id === Repeat.daily) {
      setFieldValue('every', '1');
      setFieldValue('onType', everyDailyTypes[0]);
    }
    if (val.id === Repeat.weekly) {
      setFieldValue('every', '');
    }
    if (val.id === Repeat.monthly) {
      setFieldValue('every', '1');
      setFieldValue('onType', onTypes[0]);
      setFieldValue('onDay', null);
    }
    if (val.id === Repeat.yearly) {
      setFieldValue('every', monthOptions[0]);
      setFieldValue('onType', onTypes[0]);
      setFieldValue('onDay', null);
    }
  };

  const onSubmit = (params, isInit = false) => {
    onClose();
    const cronExpression = transformToCronExpression(params, params.frequency.id);

    console.log('cronExpression');
    console.log(cronExpression);
    params.cronExpression = cronExpression;
    params.minuteDuration = params.durations;
    formMethods.reset(params);
    onSubmitForm(params, isInit);
  };

  const handleRemove = () => {
    Alert.alert(I18n.t('AD_PM_PLAN_REMOVE_RECURRENCE_TITLE'), I18n.t('AD_PM_PLAN_REMOVE_RECURRENCE_ASK'), [
      {
        text: I18n.t('AD_COMMON_CANCEL'),
        style: 'cancel',
      },
      {
        text: I18n.t('AD_COMMON_YES'),
        onPress: () => {
          onRemove();
          formMethods.reset(initialValues);
          onClose();
        },
      },
    ]);
  };

  function term(str, char) {
    const xStr = str.substring(0, str.length - 1);
    return xStr + char;
  }

  const onChangeDay = (text, key) => {
    if (text.includes('.') || text.includes(',')) {
      const newText = term(text, '');
      setFieldValue(key, newText);
    } else {
      setFieldValue(key, text);
    }
  };

  const [frequency, endDate, onDay, dayOfWeeks, durations, onType] = watch([
    'frequency',
    'endDate',
    'onDay',
    'dayOfWeeks',
    'durations',
    'onType',
  ]);

  const isDaily = frequency?.id === Repeat.daily;
  const isWeekly = frequency?.id === Repeat.weekly;
  const isMonthly = frequency?.id === Repeat.monthly;
  const isYearly = frequency?.id === Repeat.yearly;
  const disabledBtn =
    !endDate ||
    (!onDay?.name && isMonthly) ||
    (!onDay?.name && isYearly) ||
    (!dayOfWeeks.length > 0 && isWeekly) ||
    !durations;

  return (
    <Modal visible={visible}>
      <SafeAreaView />
      <Header title={I18n.t('AD_PM_REPEAT_SETTING')} renderViewLeft={renderLeft()} />
      <Wrapper>
        <FormProvider {...formMethods}>
          <AwareScrollView>
            <FormDropdown
              label="AD_PM_FREQUENCY"
              name="frequency"
              options={frequencyOptions}
              showValue={false}
              onChange={(val) => onChangeFrequencyVal(val)}
            />
            {!isYearly && !isWeekly ? (
              <View>
                <Row>
                  {isDaily && (
                    <ItemRow style={{ width: onType?.id === 1 ? '38%' : '100%' }}>
                      <FormDropdown label="AD_PM_ON" name="onType" options={everyDailyTypes} showValue={false} />
                    </ItemRow>
                  )}

                  {onType?.id === 2 && isDaily ? null : (
                    <ItemRow style={{ width: isMonthly ? '100%' : '60%' }}>
                      <FormInput
                        keyboardType="numeric"
                        label="AD_PM_EVERY"
                        name="every"
                        onChangeText={(text) => onChangeDay(text, 'every')}
                      />
                      <TextEvery
                        color={Colors.gray}
                        text={I18n.t(isDaily ? 'AD_PM_EVERY_DAY' : isWeekly ? 'AD_PM_EVERY_WEEK' : 'AD_PM_EVERY_MONTH')}
                      />
                    </ItemRow>
                  )}
                </Row>
              </View>
            ) : null}
            {isYearly && <FormDropdown label="AD_PM_EVERY" name="every" options={monthOptions} showValue={false} />}
            {(isMonthly || isYearly) && (
              <Row>
                <ItemRow style={{ width: '38%' }}>
                  <FormDropdown
                    label="AD_PM_ON"
                    name="onType"
                    onChange={() => setFieldValue('onDay', null)}
                    options={onTypes}
                    showValue={false}
                  />
                </ItemRow>
                <ItemRow style={{ width: '60%' }}>
                  {onType?.id !== 'DAY' ? (
                    <FormDropdown label=" " name="onDay" options={dayOfWeeksOptions} showValue={false} />
                  ) : (
                    <FormInput
                      label=" "
                      name="onDay.name"
                      onChangeText={(text) => onChangeDay(text, 'onDay.name')}
                      keyboardType="numeric"
                    />
                  )}
                </ItemRow>
              </Row>
            )}

            {isWeekly && (
              <FormDropdown
                label="AD_PM_ON_DAYS"
                name="dayOfWeeks"
                multiple
                options={dayOfWeeksOptions}
                showValue={false}
              />
            )}
            {isMonthly && onType?.id !== 'DAY' && (
              <FormDropdown label="AD_PM_START_AT_MONTH" name="startAt" options={monthOptions} showValue={false} />
            )}
            {(isMonthly && onType?.id === 'DAY') || (isYearly && onType?.id === 'DAY') ? (
              <FormCheckBox name="isNearestWeekday" label="AD_PM_RECURRENCE_NEAREST_WEEK_DAY" />
            ) : null}
            <FormDate label="AD_PM_START_TIME" name="startTime" overflow={false} mode="time" />

            <FormInput
              keyboardType="numeric"
              label="AD_PM_DURATIONS"
              name="durations"
              onChangeText={(text) => onChangeDay(text, 'durations')}
            />

            <FormDate label="COMMON_START_DATE" name="startDate" overflow={false} />
            <FormDate label="COMMON_END_DATE" name="endDate" overflow={false} />
          </AwareScrollView>
          <Row>
            {onRemove && (
              <Button
                rounded
                danger
                containerStyle={{
                  width: '55%',
                }}
                title={I18n.t('AD_PM_REMOVE_RECURRENCE')}
                onPress={handleRemove}
              />
            )}

            <Button
              rounded
              primary={!disabledBtn}
              disabled={disabledBtn}
              containerStyle={{
                width: !onRemove ? '100%' : '40%',
              }}
              title={I18n.t('COMMON_ACCEPT')}
              onPress={handleSubmit(onSubmit)}
            />
          </Row>
        </FormProvider>
      </Wrapper>
      <SafeAreaView />
    </Modal>
  );
};

export default ConfigRecurrenceModal;
