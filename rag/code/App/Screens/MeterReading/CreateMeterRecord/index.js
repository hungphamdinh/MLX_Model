import React, { useEffect } from 'react';
import _ from 'lodash';
import I18n from '@I18n';
import styled from 'styled-components';
import { FormProvider } from 'react-hook-form';
import moment from 'moment';
import AwareScrollView from '@Components/Layout/AwareScrollView';
import * as Yup from 'yup';
import {
  FormDate,
  FormDropdown,
  FormInput,
  FormLazyDropdown,
  FormDocumentPicker,
  FormNumberInput,
  FormRadioGroup,
} from '@Forms';
import { View } from 'react-native';
import { Button } from '@Elements';
import Row from '@Components/Grid/Row';
import styles from './styles';

import useMeterReading from '../../../Context/MeterReading/Hooks/UseMeterReading';

import BaseLayout from '../../../Components/Layout/BaseLayout';
import FormSuggestionPicker, { SuggestionTypes } from '../../../Components/Forms/FormSuggestionPicker';
import LocaleConfig from '../../../Config/LocaleConfig';
import { meterReadingPeriods, meterReadingYears } from '../../../Config/Constants';
import { useCompatibleForm, useYupValidationResolver } from '../../../Utils/hook';
import FormMoneyInput from '../../../Components/Forms/FormMoneyInput';

const PeriodWrapper = styled.View`
  flex: 0.5;
`;
const Divider = styled.View`
  margin-horizontal: 7px;
`;

const RowWrapper = styled.View`
  flex-direction: row;
  flex: 1;
`;

const CreateMeterRecord = ({ navigation }) => {
  const isFromScanQRRef = React.useRef(false);
  const id = navigation?.getParam('id');
  const requiredQuestion = I18n.t('FORM_THIS_FIELD_IS_REQUIRED');
  const validationSchema = Yup.object().shape({
    locationSelect: Yup.object()
      .nullable()
      .when(['meterLocationType'], {
        is: (meterLocationType) => _.first(meterLocationType) === 'location',
        then: Yup.object().nullable().required(requiredQuestion),
      }),
    unitSelect: Yup.object()
      .nullable()
      .when(['meterLocationType'], {
        is: (meterLocationType) => _.first(meterLocationType) === 'unit',
        then: Yup.object().nullable().required(requiredQuestion),
      }),
  });
  const {
    isLoading,
    meterReading: { meterDevices, meterDeviceByCode, settings },
    getMeterDevices,
    createMeterReading,
    getMeterDeviceByQRCode,
  } = useMeterReading();

  const formMethods = useCompatibleForm({
    resolver: useYupValidationResolver(validationSchema),
    defaultValues: {
      meterDevice: null,
      meterVal: {
        text: '0',
        rawValue: 0,
      },
      totalCost: {
        text: '0',
        rawValue: 0,
      },
      readingDate: new Date(),
      period: (new Date().getMonth() + 1).toString(),
      comment: '',
      images: [],
      year: new Date().getFullYear().toString(),
      locationSelect: null,
      meterLocationType: ['location'],
    },
  });

  const { setFieldValue, watch } = formMethods;
  const tariffRate = settings?.tariffRate || null;

  const meterVal = watch('meterVal')?.rawValue || 0;

  useEffect(() => {
    const calculatedTotalCost = meterVal * tariffRate;
    formMethods.setValue('totalCost', { rawValue: calculatedTotalCost, text: calculatedTotalCost });
  }, [meterVal, tariffRate]);

  const [meterLocationType, locationSelect, unitSelect] = watch(['meterLocationType', 'locationSelect', 'unitSelect']);
  const isUnitType = React.useMemo(() => _.first(meterLocationType) === 'unit', [meterLocationType]);
  const mainLayoutProps = {
    showBell: true,
    noPadding: true,
    loading: isLoading,
    title: I18n.t('METER_READING_CREATE'),
    containerStyle: { paddingHorizontal: 15 },
  };

  const getListMeter = (page = 1, keyword = '') => {
    const unitIds = isUnitType && unitSelect ? unitSelect.id : undefined;
    const locationIds = !isUnitType && locationSelect ? locationSelect.id : undefined;
    getMeterDevices({
      page,
      params: {
        keyword,
        locationIds,
        unitIds,
      },
    });
  };

  useEffect(() => {
    if (id) {
      getMeterDeviceByQRCode(id);
    }
  }, []);

  useEffect(() => {
    if (id && meterDeviceByCode) {
      isFromScanQRRef.current = true;
      setFieldValue('locationSelect', meterDeviceByCode.location);
      setFieldValue('unitSelect', meterDeviceByCode.unit);
      setFieldValue('meterDevice', meterDeviceByCode);
      setFieldValue('meterLocationType', [meterDeviceByCode.unit ? 'unit' : 'location']);
    }
  }, [id, meterDeviceByCode]);

  useEffect(() => {
    if (isFromScanQRRef.current) {
      return;
    }
    setFieldValue(isUnitType ? 'locationSelect' : 'unitSelect', null);
    setFieldValue('meterDeviceId', null);
  }, [isUnitType, isFromScanQRRef]);

  useEffect(() => {
    if (locationSelect || unitSelect) {
      getListMeter();
    }
  }, [locationSelect, unitSelect]);

  const onSubmit = async ({ images, unit, ...values }) => {
    const {
      comment,
      readingDate,
      period,
      meterVal: { rawValue },
      meterDevice,
      totalCost,
    } = values;
    const yearVal = values.year;
    const params = {
      meterDeviceId: meterDevice?.id,
      comment,
      readingDate: moment(readingDate, LocaleConfig.dateTimeFormat).format(),
      period: parseInt(period, 10),
      year: parseInt(yearVal, 10),
      value: rawValue,
      totalCost: totalCost.rawValue || null,
      tariffRate,
    };
    const uploadImages = images.filter((item) => item.path);

    const response = await createMeterReading(params, uploadImages);
    if (response) {
      navigation.goBack();
    }
  };

  // const onChangeLocation = async (locationSelect) => {
  //   const response = await getMeterDevices({ page: 1, params: { keyword: '', locationIds: locationSelect.id } });
  //
  //   if (response) {
  //     setFieldValue('meterDeviceId', response.items[0].id);
  //     setFieldValue('locationSelect', locationSelect);
  //   }
  // };

  const meterLocationTypes = [
    {
      label: I18n.t('AD_CRWO_TITLE_UNIT_LOCATION'),
      value: 'unit',
    },
    {
      label: I18n.t('COMMON_LOCATION'),
      value: 'location',
    },
  ];

  const readingOptions = {
    precision: settings?.decimalPlace || 0,
    separator: LocaleConfig.decimalSeparator,
    delimiter: LocaleConfig.groupSeparator,
    unit: '',
    suffix: '',
  };

  return (
    <BaseLayout {...mainLayoutProps}>
      <FormProvider {...formMethods}>
        <AwareScrollView>
          <RowWrapper>
            <PeriodWrapper>
              <FormDropdown
                valKey="value"
                required
                options={meterReadingPeriods}
                title="METER_READING_PERIOD"
                label="METER_READING_PERIOD"
                placeholder=""
                name="period"
              />
            </PeriodWrapper>
            <Divider />
            <PeriodWrapper>
              <FormDropdown
                valKey="value"
                required
                title="METER_READING_YEAR"
                options={meterReadingYears}
                label="METER_READING_YEAR"
                placeholder=""
                name="year"
              />
            </PeriodWrapper>
          </RowWrapper>
          <FormRadioGroup
            options={meterLocationTypes}
            name="meterLocationType"
            horizontal
            required
            label="COMMON_UNIT_OR_LOCATION"
            onChange={() => (isFromScanQRRef.current = false)}
          />
          <View>
            <FormSuggestionPicker
              required
              type={SuggestionTypes.SIMPLE_UNIT}
              name="unitSelect"
              keywordName="keyWordFullUnitCode"
              style={{ display: !isUnitType ? 'none' : 'flex' }}
              addOnParams={{ IsFilterMeterDeviceId: true }}
            />
            <FormSuggestionPicker
              required
              type={SuggestionTypes.LOCATION}
              name="locationSelect"
              // onChange={onChangeLocation}
              addOnParams={{ IsFilterMeterDeviceId: true, page: 1, pageSize: 50 }}
              style={{ display: isUnitType ? 'none' : 'flex' }}
            />
          </View>

          <FormLazyDropdown
            listExist={meterDevices.data}
            isDropdownItem
            showSearchBar
            required
            getList={(page, key) => getListMeter(page, key)}
            options={meterDevices}
            title="METER_READING_METER_TYPE_DEVICE"
            label="METER_READING_METER_TYPE_DEVICE"
            placeholder={I18n.t('METER_READING_SELECT_METER_DEVICE')}
            fieldName="meterName"
            titleKey="meterName"
            valKey="id"
            name="meterDevice"
            disabled={!unitSelect && !locationSelect}
          />
          <FormNumberInput
            noBorder
            required
            includeSymbol
            textOptions={readingOptions}
            maxLength={null}
            label="METER_READING_METER_RECORD"
            placeholder={I18n.t('METER_READING_METER_RECORD')}
            name="meterVal"
          />
          {!!tariffRate && (
            <>
              <FormInput
                label="METER_READING_TARIFF_RATE"
                placeholder="METER_READING_TARIFF_RATE"
                editable={false}
                name="tariffRate"
                value={tariffRate}
              />
              <FormMoneyInput
                editable={false}
                label="METER_READING_TOTAL_COST"
                placeholder={I18n.t('METER_READING_TOTAL_COST')}
                name="totalCost"
              />
            </>
          )}
          <FormDate
            inputStyle={{ paddingLeft: 10 }}
            label={I18n.t('METER_READING_READING_DATE')}
            name="readingDate"
            required
          />
          <FormInput
            label="METER_READING_COMMENT"
            placeholder="METER_READING_COMMENT"
            name="comment"
            multiline
            mode="noBorder"
          />
          <FormDocumentPicker name="images" label="COMMON_IMAGES" />
          <Row style={styles.bottomContainer}>
            <Button
              primary
              rounded
              onPress={formMethods.handleSubmit(onSubmit)}
              title={I18n.t('AD_COMMON_SAVE')}
              containerStyle={styles.bottomButton}
            />
          </Row>
        </AwareScrollView>
      </FormProvider>
    </BaseLayout>
  );
};

export default CreateMeterRecord;
