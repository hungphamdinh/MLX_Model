export const GET_ALL_ATTENDANCES_REQUEST = 'attendance/GET_ALL_ATTENDANCES_REQUEST';
export const GET_ALL_ATTENDANCES_SUCCESS = 'attendance/GET_ALL_ATTENDANCES_SUCCESS';
export const GET_ALL_ATTENDANCES_FAILURE = 'attendance/GET_ALL_ATTENDANCES_FAILURE';

export const DETAIL_ATTENDANCE_REQUEST = 'attendance/DETAIL_ATTENDANCE_REQUEST';
export const DETAIL_ATTENDANCE_SUCCESS = 'attendance/DETAIL_ATTENDANCE_SUCCESS';
export const DETAIL_ATTENDANCE_FAILURE = 'attendance/DETAIL_ATTENDANCE_FAILURE';

export const GET_CURRENT_LOCATION_REQUEST = 'attendance/GET_CURRENT_LOCATION_REQUEST';
export const GET_CURRENT_LOCATION_SUCCESS = 'attendance/GET_CURRENT_LOCATION_SUCCESS';
export const GET_CURRENT_LOCATION_FAILURE = 'attendance/GET_CURRENT_LOCATION_FAILURE';

export const CHECK_OUT_LOCATION_REQUEST = 'attendance/CHECK_OUT_LOCATION_REQUEST';
export const CHECK_OUT_LOCATION_SUCCESS = 'attendance/CHECK_OUT_LOCATION_SUCCESS';
export const CHECK_OUT_LOCATION_FAILURE = 'attendance/CHECK_OUT_LOCATION_FAILURE';

export const CHECK_IN_LOCATION_REQUEST = 'attendance/CHECK_IN_LOCATION_REQUEST';
export const CHECK_IN_LOCATION_SUCCESS = 'attendance/CHECK_IN_LOCATION_SUCCESS';
export const CHECK_IN_LOCATION_FAILURE = 'attendance/CHECK_IN_LOCATION_FAILURE';

export const GET_DISTANCE_AREA_REQUEST = 'attendance/GET_DISTANCE_AREA_REQUEST';
export const GET_DISTANCE_AREA_SUCCESS = 'attendance/GET_DISTANCE_AREA_SUCCESS';
export const GET_DISTANCE_AREA_FAILURE = 'attendance/GET_DISTANCE_AREA_FAILURE';

export const getAllAttendancesRequest = (payload) => ({
  type: GET_ALL_ATTENDANCES_REQUEST,
  payload,
});

export const getAllAttendancesSuccess = (payload) => ({
  type: GET_ALL_ATTENDANCES_SUCCESS,
  payload,
});

export const getAllAttendancesFailure = (payload) => ({
  type: GET_ALL_ATTENDANCES_FAILURE,
  payload,
});

export const detailAttendanceRequest = (payload) => ({
  type: DETAIL_ATTENDANCE_REQUEST,
  payload,
});

export const detailAttendanceSuccess = (payload) => ({
  type: DETAIL_ATTENDANCE_SUCCESS,
  payload,
});

export const detailAttendanceFailure = (payload) => ({
  type: DETAIL_ATTENDANCE_FAILURE,
  payload,
});

export const getCurrentLocationRequest = (payload) => ({
  type: GET_CURRENT_LOCATION_REQUEST,
  payload,
});

export const getCurrentLocationSuccess = (payload) => ({
  type: GET_CURRENT_LOCATION_SUCCESS,
  payload,
});

export const getCurrentLocationFailure = (payload) => ({
  type: GET_CURRENT_LOCATION_FAILURE,
  payload,
});

export const checkOutLocationRequest = (payload) => ({
  type: CHECK_OUT_LOCATION_REQUEST,
  payload,
});

export const checkOutLocationSuccess = (payload) => ({
  type: CHECK_OUT_LOCATION_SUCCESS,
  payload,
});

export const checkOutLocationFailure = (payload) => ({
  type: CHECK_OUT_LOCATION_FAILURE,
  payload,
});

export const checkInLocationRequest = (payload) => ({
  type: CHECK_IN_LOCATION_REQUEST,
  payload,
});

export const checkInLocationSuccess = (payload) => ({
  type: CHECK_IN_LOCATION_SUCCESS,
  payload,
});

export const checkInLocationFailure = (payload) => ({
  type: CHECK_IN_LOCATION_FAILURE,
  payload,
});

export const getDistanceAreaRequest = (payload) => ({
  type: GET_DISTANCE_AREA_REQUEST,
  payload,
});

export const getDistanceAreaSuccess = (payload) => ({
  type: GET_DISTANCE_AREA_SUCCESS,
  payload,
});

export const getDistanceAreaFailure = (payload) => ({
  type: GET_DISTANCE_AREA_FAILURE,
  payload,
});
