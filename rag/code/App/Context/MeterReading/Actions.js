export const GET_METER_DEVICE_REQUEST = 'meterReading/GET_METER_DEVICE_REQUEST';
export const GET_METER_DEVICE_SUCCESS = 'meterReading/GET_METER_DEVICE_SUCCESS';
export const GET_METER_DEVICE_FAILURE = 'meterReading/GET_METER_DEVICE_FAILURE';

export const GET_QR_CODE_METER_DEVICE_REQUEST = 'meterReading/GET_QR_CODE_METER_DEVICE_REQUEST';
export const GET_QR_CODE_METER_DEVICE_SUCCESS = 'meterReading/GET_QR_CODE_METER_DEVICE_SUCCESS';
export const GET_QR_CODE_METER_DEVICE_FAILURE = 'meterReading/GET_QR_CODE_METER_DEVICE_FAILURE';

export const CREATE_METER_READING_REQUEST = 'meterReading/CREATE_METER_READING_REQUEST';
export const CREATE_METER_READING_SUCCESS = 'meterReading/CREATE_METER_READING_SUCCESS';
export const CREATE_METER_READING_FAILURE = 'meterReading/CREATE_METER_READING_FAILURE';

export const GET_METER_TYPES_REQUEST = 'meterReading/GET_METER_TYPES_REQUEST';
export const GET_METER_TYPES_SUCCESS = 'meterReading/GET_METER_TYPES_SUCCESS';
export const GET_METER_TYPES_FAILURE = 'meterReading/GET_METER_TYPES_FAILURE';

export const GET_METER_READINGS_REQUEST = 'meterReading/GET_METER_READINGS_REQUEST';
export const GET_METER_READINGS_SUCCESS = 'meterReading/GET_METER_READINGS_SUCCESS';
export const GET_METER_READINGS_FAILURE = 'meterReading/GET_METER_READINGS_FAILURE';

export const GET_METER_READING_HISTORIES_REQUEST = 'meterReading/GET_METER_READING_HISTORIES_REQUEST';
export const GET_METER_READING_HISTORIES_SUCCESS = 'meterReading/GET_METER_READING_HISTORIES_SUCCESS';
export const GET_METER_READING_HISTORIES_FAILURE = 'meterReading/GET_METER_READING_HISTORIES_FAILURE';

export const GET_METER_READING_CURRENT_MONTH_REQUEST = 'meterReading/GET_METER_READING_CURRENT_MONTH_REQUEST';
export const GET_METER_READING_CURRENT_MONTH_SUCCESS = 'meterReading/GET_METER_READING_CURRENT_MONTH_SUCCESS';
export const GET_METER_READING_CURRENT_MONTH_FAILURE = 'meterReading/GET_METER_READING_CURRENT_MONTH_FAILURE';

export const GET_METER_DEVICE_RELATIONSHIP_REQUEST = 'meterReading/GET_METER_DEVICE_RELATIONSHIP_REQUEST';
export const GET_METER_DEVICE_RELATIONSHIP_SUCCESS = 'meterReading/GET_METER_DEVICE_RELATIONSHIP_SUCCESS';
export const GET_METER_DEVICE_RELATIONSHIP_FAILURE = 'meterReading/GET_METER_DEVICE_RELATIONSHIP_FAILURE';

export const GET_METER_SETTINGS_REQUEST = 'meterReading/GET_METER_SETTINGS_REQUEST';
export const GET_METER_SETTINGS_SUCCESS = 'meterReading/GET_METER_SETTINGS_SUCCESS';
export const GET_METER_SETTINGS_FAILURE = 'meterReading/GET_METER_SETTINGS_FAILURE';

export const getMeterDeviceRequest = (payload) => ({
  type: GET_METER_DEVICE_REQUEST,
  payload,
});

export const getMeterDeviceSuccess = (payload) => ({
  type: GET_METER_DEVICE_SUCCESS,
  payload,
});

export const getMeterDeviceFailure = (payload) => ({
  type: GET_METER_DEVICE_FAILURE,
  payload,
});

export const getMeterDeviceByCodeRequest = (payload) => ({
  type: GET_QR_CODE_METER_DEVICE_REQUEST,
  payload,
});

export const getMeterDeviceByCodeSuccess = (payload) => ({
  type: GET_QR_CODE_METER_DEVICE_SUCCESS,
  payload,
});

export const getMeterDeviceByCodeFailure = (payload) => ({
  type: GET_QR_CODE_METER_DEVICE_FAILURE,
  payload,
});

export const createMeterReadingRequest = (payload) => ({
  type: CREATE_METER_READING_REQUEST,
  payload,
});

export const createMeterReadingSuccess = (payload) => ({
  type: CREATE_METER_READING_SUCCESS,
  payload,
});

export const createMeterReadingFailure = (payload) => ({
  type: CREATE_METER_READING_FAILURE,
  payload,
});

export const getMeterTypesRequest = (payload) => ({
  type: GET_METER_TYPES_REQUEST,
  payload,
});

export const getMeterTypesSuccess = (payload) => ({
  type: GET_METER_TYPES_SUCCESS,
  payload,
});

export const getMeterTypesFailure = (payload) => ({
  type: GET_METER_TYPES_FAILURE,
  payload,
});

export const getMeterReadingsRequest = (payload) => ({
  type: GET_METER_READINGS_REQUEST,
  payload,
});

export const getMeterReadingsSuccess = (payload) => ({
  type: GET_METER_READINGS_SUCCESS,
  payload,
});

export const getMeterReadingsFailure = (payload) => ({
  type: GET_METER_READINGS_FAILURE,
  payload,
});

export const getMeterReadingHistoriesRequest = (payload) => ({
  type: GET_METER_READING_HISTORIES_REQUEST,
  payload,
});

export const getMeterReadingHistoriesSuccess = (payload) => ({
  type: GET_METER_READING_HISTORIES_SUCCESS,
  payload,
});

export const getMeterReadingHistoriesFailure = (payload) => ({
  type: GET_METER_READING_HISTORIES_FAILURE,
  payload,
});

export const getMeterReadingCurrentMonthRequest = (payload) => ({
  type: GET_METER_READING_CURRENT_MONTH_REQUEST,
  payload,
});

export const getMeterReadingCurrentMonthSuccess = (payload) => ({
  type: GET_METER_READING_CURRENT_MONTH_SUCCESS,
  payload,
});

export const getMeterReadingCurrentMonthFailure = (payload) => ({
  type: GET_METER_READING_CURRENT_MONTH_FAILURE,
  payload,
});

export const getMeterDeviceRelationshipRequest = (payload) => ({
  type: GET_METER_DEVICE_RELATIONSHIP_REQUEST,
  payload,
});

export const getMeterDeviceRelationshipSuccess = (payload) => ({
  type: GET_METER_DEVICE_RELATIONSHIP_SUCCESS,
  payload,
});

export const getMeterDeviceRelationshipFailure = (payload) => ({
  type: GET_METER_DEVICE_RELATIONSHIP_FAILURE,
  payload,
});

export const getMeterSettingsRequest = (payload) => ({
  type: GET_METER_SETTINGS_REQUEST,
  payload,
});

export const getMeterSettingsSuccess = (payload) => ({
  type: GET_METER_SETTINGS_SUCCESS,
  payload,
});

export const getMeterSettingsFailure = (payload) => ({
  type: GET_METER_SETTINGS_FAILURE,
  payload,
});
