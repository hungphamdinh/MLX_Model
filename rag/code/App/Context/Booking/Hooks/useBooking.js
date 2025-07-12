// useBooking.js
import _ from 'lodash';
import { useStateValue, useHandlerAction } from '../../index';
import { RequestApi } from '../../../Services';
import {
  GET_BOOKING_STATUS,
  FILTER_BOOKINGS,
  GET_BOOKING_DETAIL,
  GET_PAYMENT_STATUS,
  ADD_BOOKING,
  UPDATE_BOOKING,
  VALIDATE_RECURRING_BOOKING,
  RECURRING_BOOKING,
  GET_AMENITY_DETAIL,
  GET_AMENITIES,
  GET_ALL_TIMESLOTS,
  GET_ALL_BOOKING_PURPOSE,
} from '../Actions';

const useBooking = () => {
  const [{ booking }] = useStateValue();
  const { withLoadingAndErrorHandling, withErrorHandling } = useHandlerAction();

  const getBookingStatus = async () => {
    const response = await RequestApi.getBookingStatus();
    return response;
  };

  const filterBookings = async (params, isSorting = false) => {
    const response = await RequestApi.filterBookings(params, isSorting);
    return response;
  };

  const getAllTimeSlots = async (params) => {
    const response = await RequestApi.getAllTimeSlots(params);
    return response;
  };

  const getBookingDetail = async (reservationId) => {
    const response = await RequestApi.getBookingDetail(reservationId);
    return response;
  };

  const getPaymentStatus = async () => {
    const response = await RequestApi.getPaymentStatus();
    return response;
  };

  const addBooking = async (payload) => {
    const { files } = payload;
    const response = await RequestApi.addBooking(payload);
    if (_.size(files) > 0) {
      await RequestApi.uploadBookingFiles(
        {
          bookingId: response.guid,
        },
        files
      );
    }
    return response;
  };

  const updateBooking = async (payload) => {
    const { files } = payload;
    const response = await RequestApi.updateBooking(payload);
    if (_.size(files) > 0) {
      await RequestApi.uploadBookingFiles(
        {
          bookingId: payload?.guid,
        },
        files
      );
    }
    return response;
  };

  const validateRecurringBooking = async (payload) => {
    const response = await RequestApi.validateRecurringBooking(payload);
    return response;
  };

  const recurringBooking = async (payload) => {
    const response = await RequestApi.recurringBooking(payload);
    return response;
  };

  const getAmenityDetail = async (amenityId) => {
    const response = await RequestApi.getAmenityDetail(amenityId);
    return response;
  };

  const getAmenities = async (params) => {
    const response = await RequestApi.getAmenities(params);
    return response;
  };

  const getBookingPurpose = async () => {
    const response = await RequestApi.getBookingPurpose();
    return response;
  };

  return {
    booking,
    getBookingStatus: withErrorHandling(GET_BOOKING_STATUS, getBookingStatus),
    filterBookings: withErrorHandling(FILTER_BOOKINGS, filterBookings),
    getAllTimeSlots: withLoadingAndErrorHandling(GET_ALL_TIMESLOTS, getAllTimeSlots),
    getBookingDetail: withLoadingAndErrorHandling(GET_BOOKING_DETAIL, getBookingDetail),
    getPaymentStatus: withErrorHandling(GET_PAYMENT_STATUS, getPaymentStatus),
    addBooking: withLoadingAndErrorHandling(ADD_BOOKING, addBooking),
    updateBooking: withLoadingAndErrorHandling(UPDATE_BOOKING, updateBooking),
    validateRecurringBooking: withLoadingAndErrorHandling(VALIDATE_RECURRING_BOOKING, validateRecurringBooking),
    recurringBooking: withLoadingAndErrorHandling(RECURRING_BOOKING, recurringBooking),
    getAmenityDetail: withLoadingAndErrorHandling(GET_AMENITY_DETAIL, getAmenityDetail),
    getAmenities: withErrorHandling(GET_AMENITIES, getAmenities),
    getBookingPurpose: withErrorHandling(GET_ALL_BOOKING_PURPOSE, getBookingPurpose),
  };
};

export default useBooking;
