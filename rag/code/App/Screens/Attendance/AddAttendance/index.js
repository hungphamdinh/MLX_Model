import React, { useEffect, useState } from 'react';
import { DeviceEventEmitter, Platform, SafeAreaView } from 'react-native';
import I18n from '@I18n';
import _ from 'lodash';
import styled from 'styled-components/native';
import moment from 'moment';
import NavigationService from '@NavigationService';
import Geolocation from '@react-native-community/geolocation';
import get from 'lodash/get';
import { Button, Text } from '@Elements';
import { Colors } from '@Themes';
import BaseLayout from '@Components/Layout/BaseLayout';
import AttendanceMap from '@Components/Attendance/AttendanceMap';
import useUser from '@Context/User/Hooks/UseUser';
import { FormProvider } from 'react-hook-form';
import { FormDate, FormInput, FormNumberInput, FormSegment } from '@Components/Forms';
import AwareScrollView from '@Components/Layout/AwareScrollView';
import useAttendance from '@Context/Attendance/Hooks/UseAttendance';
import { requestLocationPermission } from '../../../Utils/permissions';
import noticeUtils from '../../../Utils/noticeUtils';
import { useCompatibleForm } from '../../../Utils/hook';
import LocaleConfig from '../../../Config/LocaleConfig';
import { toast } from '../../../Utils';

const HintMessage = styled(Text)`
  color: ${Colors.azure};
  margin-top: 10px;
  text-align: center;
  margin-bottom: 15px;
`;

function getAttendanceTime(time) {
  if (time) {
    return time.slice(0, 5);
  }
  return '';
}

const AddAttendance = () => {
  const [isLoadingMap, setIsLoadingMap] = useState(false);
  const [distance, setDistance] = useState(0);
  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const {
    attendance: { currentLocation, distanceArea },
    checkOutLocation,
    checkInLocation,
    getCurrentLocation,
  } = useAttendance();
  const {
    user: { tenant },
  } = useUser();
  const tenantName = get(tenant, 'tenantName') || '';

  const watchId = React.useRef();

  const formMethods = useCompatibleForm({
    defaultValues: {
      date: new Date(),
      temperature: {
        text: '',
        rawValue: 0,
      },
      checkingType: 0,
      description: '',
    },
  });

  const { setFieldValue, setFieldError, watch } = formMethods;
  const checkingType = watch('checkingType');
  useEffect(() => {
    getCurrentLocation();

    if (!isLoadingMap) {
      requestLocationPermission(requestLocation);
    }
    setIsLoadingMap(false);
    return () => {
      Geolocation.clearWatch(watchId.current);
    };
  }, []);

  useEffect(() => {
    if (currentLocation && !isLoadingMap) {
      if (_.get(currentLocation, 'lastActivity.state') === 0) {
        setFieldValue('checkingType', 1);
      }
    }
  }, [currentLocation, isLoadingMap]);

  const onReceiveLocation = (position) => {
    const tenantAddress = _.get(currentLocation, 'tenantAddress') || {};
    const geography = _.get(tenantAddress, 'geography') || {};
    const lat = parseFloat(position.coords.latitude);
    const lon = parseFloat(position.coords.longitude);
    const initialRegion = {
      latitude: lat,
      longitude: lon,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
    const newDistance = distanceBetween2Points(
      position.coords.latitude,
      position.coords.longitude,
      geography.latitude,
      geography.longitude
    );
    setRegion(initialRegion);
    setDistance(newDistance);
  };

  const requestLocation = () => {
    try {
      const locationParams = [
        onReceiveLocation,
        (error) => console.log(error.message),
        Platform.OS === 'android'
          ? {
              enableHighAccuracy: false,
              timeout: 25000,
              maximumAge: 3600000,
            }
          : { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
      ];

      Geolocation.getCurrentPosition(...locationParams);
      watchId.current = Geolocation.watchPosition(...locationParams);
    } catch (error) {
      toast.showError(error?.message);
    }
  };

  const onSubmit = async (formData) => {
    const isCheckIn = formData.checkingType === 0;
    const temperature = formData.temperature.rawValue;
    if (temperature > 0 && !(temperature >= 34 && temperature <= 42)) {
      setFieldError('temperature', { type: 'custom', message: I18n.t('ATTENDANCE_TEMPERATURE_REQUIRED') });
      return;
    }
    const params = {
      attendanceDateTime: moment().format(),
      latitude: region.latitude,
      longitude: region.longitude,
      temperature,
      isWell: temperature <= 37.5,
      description: formData.description,
    };
    const successContents = isCheckIn
      ? ['MODAL_CHECKIN_SUCCESS_CONTENT', 'MODAL_CHECKIN_SUCCESS_CONTENT2']
      : ['MODAL_CHECKOUT_SUCCESS_CONTENT', 'MODAL_CHECKOUT_SUCCESS_CONTENT2'];
    const submitRequest = isCheckIn ? checkInLocation : checkOutLocation;
    const result = await submitRequest(params);
    if (result) {
      NavigationService.goBack();
      DeviceEventEmitter.emit('AddOrEditAttendanceSuccess', 1);
      const message = `${I18n.t(successContents[0])} ${tenantName} ${I18n.t(successContents[1])} ${getAttendanceTime(
        result.localAttendanceTime
      )}`;
      noticeUtils.showSuccess(message);
    }
  };

  const distanceBetween2Points = (la1, lo1, la2, lo2) => {
    const dLat = (la2 - la1) * (Math.PI / 180);
    const dLon = (lo2 - lo1) * (Math.PI / 180);
    const la1ToRad = la1 * (Math.PI / 180);
    const la2ToRad = la2 * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(la1ToRad) * Math.cos(la2ToRad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = 6371 * c;
    return d;
  };

  const temperatureOptions = {
    precision: 1,
    delimiter: LocaleConfig.groupSeparator,
    separator: LocaleConfig.decimalSeparator,
    unit: '',
    suffixUnit: '',
  };

  const geography = _.get(currentLocation, 'tenantAddress.geography') || {};
  const flatCheck = distance.toFixed(2) * 1000 > distanceArea;
  const lastTimeCheckIn = _.get(currentLocation, 'lastActivity.localAttendanceDateTime') || false;
  const checkingTypeOptions = ['ATTENDANCE_CHECK_IN', 'CHECKOUT_TEXT'];

  const baseLayoutProps = {
    title: 'ATTENDANCE_CHECK_IN',
    showBell: false,
    containerStyle: { paddingHorizontal: 15 },
  };

  return (
    <BaseLayout {...baseLayoutProps}>
      <FormProvider {...formMethods}>
        <AwareScrollView>
          <FormDate label={I18n.t('COMMON_DATE')} name="date" disabled />
          <FormSegment values={checkingTypeOptions} label={I18n.t('COMMON_TYPE')} name="checkingType" />
          <FormNumberInput
            textOptions={temperatureOptions}
            label={I18n.t('ATTENDANCE_TEMPERATURE')}
            name="temperature"
          />
          <FormInput label={I18n.t('COMMON_DESCRIPTION')} name="description" multiline />
          {!isLoadingMap && <AttendanceMap region={region} geography={geography} />}
        </AwareScrollView>
        <SafeAreaView>
          <Button
            containerStyle={{ marginVertical: 15 }}
            primary
            rounded
            disabled={flatCheck}
            title={checkingType === 0 ? 'ATTENDANCE_CHECK_IN' : 'CHECKOUT_TEXT'}
            onPress={formMethods.handleSubmit(onSubmit)}
          />
          {lastTimeCheckIn && checkingType === 1 && (
            <HintMessage>
              {`${I18n.t('CHECKOUT_AT')} ${moment(lastTimeCheckIn).utc(false).format('HH:mm:ss')}`}
            </HintMessage>
          )}
        </SafeAreaView>
      </FormProvider>
    </BaseLayout>
  );
};

export default AddAttendance;
