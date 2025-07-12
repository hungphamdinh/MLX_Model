import { useState } from 'react';
import { useStateValue } from '../../index';
import {
  checkOutLocationFailure,
  checkOutLocationRequest,
  checkOutLocationSuccess,
  checkInLocationFailure,
  checkInLocationRequest,
  checkInLocationSuccess,
  detailAttendanceFailure,
  detailAttendanceRequest,
  detailAttendanceSuccess,
  getAllAttendancesFailure,
  getAllAttendancesRequest,
  getAllAttendancesSuccess,
  getCurrentLocationFailure,
  getCurrentLocationRequest,
  getCurrentLocationSuccess,
  getDistanceAreaFailure,
  getDistanceAreaSuccess,
  getDistanceAreaRequest,
} from '../Actions';
import { RequestApi } from '../../../Services';
import { handleResponse } from '../../../Utils/Api';

const useAttendance = () => {
  const [{ attendance }, dispatch] = useStateValue();
  const [isLoading, setIsLoading] = useState(false);

  const getAllAttendances = async (params) => {
    setIsLoading(true);
    try {
      dispatch(getAllAttendancesRequest(params));
      const response = await RequestApi.getAttendanceLogs(params);
      dispatch(getAllAttendancesSuccess(response));
    } catch (err) {
      dispatch(getAllAttendancesFailure(err));
    } finally {
      setIsLoading(false);
    }
  };

  const checkInLocation = async (params) => {
    setIsLoading(true);
    try {
      dispatch(checkInLocationRequest(params));
      const response = await RequestApi.checkInLocation(params);
      dispatch(checkInLocationSuccess(response));
      return response;
    } catch (err) {
      dispatch(checkInLocationFailure(err));
    } finally {
      setIsLoading(false);
    }
    return null;
  };

  const checkOutLocation = async (params) => {
    setIsLoading(true);
    try {
      dispatch(checkOutLocationRequest(params));
      const response = await RequestApi.checkOutLocation(params);
      dispatch(checkOutLocationSuccess(response));
      return response;
    } catch (err) {
      dispatch(checkOutLocationFailure(err));
    } finally {
      setIsLoading(false);
    }
    return null;
  };

  const detailAttendance = async (params) => {
    setIsLoading(true);
    try {
      dispatch(detailAttendanceRequest(params));
      const response = await RequestApi.getAttendanceDetailLogs(params);
      dispatch(detailAttendanceSuccess(response));
    } catch (err) {
      dispatch(detailAttendanceFailure(err));
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLocation = async (params) => {
    setIsLoading(true);
    try {
      dispatch(getCurrentLocationRequest(params));
      const response = await RequestApi.getCurrentLocation(params);
      dispatch(getCurrentLocationSuccess(response));
    } catch (err) {
      dispatch(getCurrentLocationFailure(err));
    } finally {
      setIsLoading(false);
    }
  };

  const getDistanceArea = async (params) => {
    setIsLoading(true);
    try {
      dispatch(getDistanceAreaRequest(params));
      const response = await RequestApi.getDistanceArea(params);
      dispatch(getDistanceAreaSuccess(response));
    } catch (err) {
      dispatch(getDistanceAreaFailure(err));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    attendance,
    isLoading,
    getAllAttendances,
    checkOutLocation,
    checkInLocation,
    getCurrentLocation,
    getDistanceArea,
    detailAttendance,
  };
};

export default useAttendance;
