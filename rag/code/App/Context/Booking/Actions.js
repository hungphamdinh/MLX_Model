// bookingActions.js
import { generateAction } from '../../Utils/AppAction';

export const GET_BOOKING_STATUS = generateAction('booking/GET_BOOKING_STATUS');
export const FILTER_BOOKINGS = generateAction('booking/FILTER_BOOKINGS');
export const GET_BOOKING_DETAIL = generateAction('booking/GET_BOOKING_DETAIL');
export const GET_PAYMENT_STATUS = generateAction('booking/GET_PAYMENT_STATUS');
export const ADD_BOOKING = generateAction('booking/ADD_BOOKING');
export const UPDATE_BOOKING = generateAction('booking/UPDATE_BOOKING');
export const VALIDATE_RECURRING_BOOKING = generateAction('booking/VALIDATE_RECURRING_BOOKING');
export const RECURRING_BOOKING = generateAction('booking/RECURRING_BOOKING');
export const GET_AMENITY_DETAIL = generateAction('booking/GET_AMENITY_DETAIL');
export const GET_ALL_BOOKING_PURPOSE = generateAction('booking/GET_ALL_BOOKING_PURPOSE');
export const GET_ALL_TIMESLOTS = generateAction('booking/GET_ALL_TIMESLOTS');
export const RESET_BOOKING_DETAIL = 'booking/RESET_BOOKING_DETAIL';
export const resetBookingDetailRequest = () => ({
  type: RESET_BOOKING_DETAIL,
});

export const GET_AMENITIES = generateAction('booking/GET_AMENITIES');
