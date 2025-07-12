import React from 'react';
import styled from 'styled-components/native';
import { Alert, Modal, View, SafeAreaView } from 'react-native';
import I18n from '@I18n';
import { FormProvider } from 'react-hook-form';
import { FormDate, FormDropdown, FormInput } from '@Forms';
import { Button, Icon, Text } from '@Elements';
import ButtonHint from '@Elements/ButtonHint';
import { Colors } from '@Themes';
import { Repeat, FREQUENCY_TYPES, DAILY_TYPE_KEYS, ON_TYPE_KEYS, WEEK_DAY_KEYS } from '@Config/Constants';
import AwareScrollView from '@Components/Layout/AwareScrollView';
import { icons } from '@Resources/icon';
import useBookingRecurrence from '@Components/Booking/BookingRecurring/useBookingRecurrence';

import * as Yup from 'yup';
import { useYupValidationResolver, useCompatibleForm } from '@Utils/hook';
import Header from '../../../Header';

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

const ConfigRecurrenceModal = ({ visible, onClose, onSubmitForm, reservation, onRemove, testID }) => {
  const frequencyOptions = FREQUENCY_TYPES.map(({ id, labelKey }) => ({
    id,
    name: I18n.t(labelKey),
  }));

  // 2) “Every daily” types
  const everyDailyTypes = DAILY_TYPE_KEYS.map((labelKey, idx) => ({
    id: idx + 1,
    label: I18n.t(labelKey),
  }));

  // 3) “On”-type for monthly (with code for the “last” option)
  const onTypes = ON_TYPE_KEYS.map((key, idx) => ({
    id: key,
    label: I18n.t(`COMMON_${key}`),
    code: key === 'LAST' ? 'L' : idx.toString(),
  }));

  // 4) Week-of-week picker
  const dayOfWeeksOptions = WEEK_DAY_KEYS.map((key, idx) => ({
    id: idx + 1,
    name: I18n.t(`COMMON_${key}`),
    code: key.substring(0, 3).toUpperCase(),
  }));

  const monthDaysOptions = [
    ...Array.from({ length: 31 }, (_, i) => ({
      id: i + 1,
      name: `${I18n.t('COMMON_DAY')} ${i + 1}`,
    })),
    { id: 'L', name: I18n.t('RECURRENCE_LAST_DAY') },
  ];

  // automatically select today's weekday when frequency is weekly
  const todayWeekdayId = new Date().getDay() + 1;
  const defaultWeeklyDays = dayOfWeeksOptions.filter((item) => item.id === todayWeekdayId);

  const initialValues = {
    frequency: frequencyOptions[0],
    month: '',
    every: '1',
    dayOfWeeks: defaultWeeklyDays,
    onType: everyDailyTypes[0],
    onDay: null,
    startDate: new Date(),
    endDate: undefined,
  };

  const validationSchema = Yup.object().shape({
    startDate: Yup.date().required(I18n.t('FORM_THIS_FIELD_IS_REQUIRED')),
    endDate: Yup.date().required(I18n.t('FORM_THIS_FIELD_IS_REQUIRED')),
    every: Yup.string()
      .transform((value) => (value ? value.trim() : value))
      .when('frequency', {
        is: (val) => val.id === Repeat.monthly,
        then: Yup.string()
          .required(I18n.t('FORM_THIS_FIELD_IS_REQUIRED'))
          .matches(/^[1-3]$/, I18n.t('RECURRENCE_EVERY_MONTH_VALIDATIOM')),
      }),
  });

  const resolver = useYupValidationResolver(validationSchema);
  const formMethods = useCompatibleForm({
    defaultValues: initialValues,
    resolver,
  });

  const { setFieldValue, handleSubmit, watch } = formMethods;

  const { generateTimeSlots } = useBookingRecurrence();

  const onSubmit = (params, bookingTimes = reservation) => {
    onClose();
    // generate explicit booking times
    const slots = generateTimeSlots(params, bookingTimes);
    params.bookingTimes = slots;
    formMethods.reset(params);
    onSubmitForm(params);
  };


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

  const [frequency, onType] = watch(['frequency', 'onType']);

  const isDaily = frequency?.id === Repeat.daily;
  const isWeekly = frequency?.id === Repeat.weekly;
  const isMonthly = frequency?.id === Repeat.monthly;

  return (
    <Modal testID={testID} visible={visible}>
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
            {!isWeekly ? (
              <View>
                <Row>
                  {onType?.id === 2 && isDaily ? null : (
                    <ItemRow style={{ width: isMonthly || isDaily ? '100%' : '60%' }}>
                      <FormInput
                        keyboardType="numeric"
                        label="AD_PM_EVERY"
                        name="every"
                        onChangeText={(text) => onChangeDay(text, 'every')}
                        rightButton={isMonthly && <ButtonHint content="RECURRENCE_EVERY_MONTH_VALIDATIOM" />}
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
            {isMonthly && (
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
                    <FormDropdown label=" " name="onDay" options={monthDaysOptions} showValue={false} />
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

            <FormDate label="COMMON_START_DATE" name="startDate" overflow={false} />
            <FormDate label="COMMON_END_DATE" name="endDate" overflow={false} />
          </AwareScrollView>
          <Row>
            {onRemove && (
              <Button
                rounded
                danger
                containerStyle={{
                  width: '47%',
                }}
                title={I18n.t('AD_COMMON_REMOVE')}
                onPress={handleRemove}
              />
            )}

            <Button
              rounded
              primary
              containerStyle={{
                width: '47%',
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
