import { useStateValue } from '../../index';
import {
  createMeterReadingFailure,
  createMeterReadingRequest,
  createMeterReadingSuccess,
  getMeterDeviceByCodeFailure,
  getMeterDeviceByCodeRequest,
  getMeterDeviceByCodeSuccess,
  getMeterDeviceFailure,
  getMeterDeviceRelationshipFailure,
  getMeterDeviceRelationshipRequest,
  getMeterDeviceRelationshipSuccess,
  getMeterDeviceRequest,
  getMeterDeviceSuccess,
  getMeterReadingCurrentMonthFailure,
  getMeterReadingCurrentMonthRequest,
  getMeterReadingCurrentMonthSuccess,
  getMeterReadingHistoriesFailure,
  getMeterReadingHistoriesRequest,
  getMeterReadingHistoriesSuccess,
  getMeterReadingsFailure,
  getMeterReadingsRequest,
  getMeterReadingsSuccess,
  getMeterSettingsFailure,
  getMeterSettingsRequest,
  getMeterSettingsSuccess,
  getMeterTypesFailure,
  getMeterTypesRequest,
  getMeterTypesSuccess,
} from '../Actions';
import { RequestApi } from '../../../Services';
import { MeterDeviceType } from '../../../Config/Constants';

const useMeterReading = () => {
  const [{ meterReading }, dispatch] = useStateValue();

  const getMeterDevices = async (payload) => {
    try {
      const { page, params = '' } = payload;
      dispatch(getMeterDeviceRequest(payload));
      const response = await RequestApi.getMeterDevices(page, params);
      dispatch(getMeterDeviceSuccess(response));
      return response;
    } catch (err) {
      dispatch(getMeterDeviceFailure(err));
    }
    return null;
  };

  const getMeterDeviceByQRCode = async (serialCode) => {
    try {
      dispatch(getMeterDeviceByCodeRequest());
      const response = await RequestApi.getMeteDeviceByCode(serialCode);
      dispatch(getMeterDeviceByCodeSuccess(response));
    } catch (err) {
      dispatch(getMeterDeviceByCodeFailure(err));
    }
  };

  const createMeterReading = async (params, file) => {
    dispatch(createMeterReadingRequest(params));
    try {
      const response = await RequestApi.createMeterReading(params, file);
      dispatch(createMeterReadingSuccess());
      return response;
    } catch (err) {
      dispatch(createMeterReadingFailure(err));
    }
    return null;
  };

  const getMeterReadings = async (payload) => {
    try {
      dispatch(getMeterReadingsRequest(payload));
      const response = await RequestApi.getMeterReadings(payload);
      dispatch(getMeterReadingsSuccess(response));
      return response;
    } catch (err) {
      dispatch(getMeterReadingsFailure(err));
    }
    return null;
  };

  const getMeterTypes = async () => {
    try {
      dispatch(getMeterTypesRequest());
      const response = await RequestApi.getMeterTypes();
      dispatch(getMeterTypesSuccess(response.items));
    } catch (err) {
      dispatch(getMeterTypesFailure(err));
    }
  };

  const getMeterReadingHistories = async (meterReadingId) => {
    try {
      dispatch(getMeterReadingHistoriesRequest(meterReadingId));
      const response = await RequestApi.getMeterReadingHistories(meterReadingId);
      dispatch(
        getMeterReadingHistoriesSuccess({
          items: response,
          totalCount: response.length,
        })
      );
    } catch (err) {
      dispatch(getMeterReadingHistoriesFailure(err));
    }
  };

  const getMeterReadingCurrentMonth = async (meterReadingId) => {
    try {
      dispatch(getMeterReadingCurrentMonthRequest(meterReadingId));
      const response = await RequestApi.getMeterReadingCurrentMonth(meterReadingId);
      dispatch(
        getMeterReadingCurrentMonthSuccess({
          items: response,
          totalCount: response.length,
        })
      );
    } catch (err) {
      dispatch(getMeterReadingCurrentMonthFailure(err));
    }
  };

  const getMeterDeviceRelationship = async (id) => {
    try {
      dispatch(getMeterDeviceRelationshipRequest(id));
      const meterDevices = await RequestApi.getMeterDeviceRelationship(id);
      const masterDevice = meterDevices.find((item) => item.deviceType === MeterDeviceType.master);
      const subDevices = meterDevices.filter((item) => item.deviceType !== MeterDeviceType.master);

      dispatch(getMeterDeviceRelationshipSuccess({ masterDevice, subDevices }));
    } catch (err) {
      dispatch(getMeterDeviceRelationshipFailure(err));
    }
  };

  const getMeterSettings = async () => {
    try {
      dispatch(getMeterSettingsRequest());
      const result = await RequestApi.getMeterSetting();
      dispatch(getMeterSettingsSuccess(result));
    } catch (err) {
      dispatch(getMeterSettingsFailure(err));
    }
  };

  return {
    getMeterDevices,
    createMeterReading,
    getMeterDeviceByQRCode,
    getMeterReadings,
    meterReading,
    getMeterTypes,
    getMeterReadingHistories,
    getMeterReadingCurrentMonth,
    getMeterDeviceRelationship,
    getMeterSettings,
  };
};

export default useMeterReading;
