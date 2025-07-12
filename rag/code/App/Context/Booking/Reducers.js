// bookingReducer.js
import _ from 'lodash';
import ListModel from '../Model/ListModel';
import {
  GET_BOOKING_STATUS,
  FILTER_BOOKINGS,
  GET_BOOKING_DETAIL,
  GET_PAYMENT_STATUS,
  RESET_BOOKING_DETAIL,
  GET_AMENITY_DETAIL,
  GET_AMENITIES,
  GET_ALL_TIMESLOTS,
  GET_ALL_BOOKING_PURPOSE,
} from './Actions';

export const INITIAL_STATE = {
  list: new ListModel(),
  statusList: [],
  paymentStatusList: [],
  bookingDetail: null,
  topRecent: [],
  bookingSlots: [],
  statistic: null,
  auditLogs: [],
  bookingPeriod: null,
  amenityDetail: null,
  amenityList: [],
  bookingPurposes: [],
  amenitiesFilter: [],
};

const transformAmenities = (data) =>
  data.map((item) => {
    item.tagName = item.isActive ? '' : 'INACTIVE';
    return item;
  });

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_BOOKING_STATUS.SUCCESS:
      return {
        ...state,
        statusList: action.payload,
      };

    case FILTER_BOOKINGS.REQUEST: {
      const { list } = state;
      list.setPage(action.payload.page);
      return {
        ...state,
        list: _.cloneDeep(list),
      };
    }
    case FILTER_BOOKINGS.SUCCESS: {
      const { list } = state;
      list.setData(action.payload);
      return {
        ...state,
        list: _.cloneDeep(list),
      };
    }

    case GET_ALL_TIMESLOTS.REQUEST:
      return {
        ...state,
        bookingSlots: [],
      };

    case GET_ALL_TIMESLOTS.SUCCESS:
      return {
        ...state,
        bookingSlots: action.payload,
      };

    case GET_BOOKING_DETAIL.SUCCESS:
      return {
        ...state,
        bookingDetail: action.payload,
      };

    case GET_PAYMENT_STATUS.SUCCESS:
      return {
        ...state,
        paymentStatusList: action.payload,
      };

    case RESET_BOOKING_DETAIL:
      return {
        ...state,
        bookingDetail: null,
      };

    case GET_AMENITY_DETAIL.REQUEST:
      return {
        ...state,
        amenityDetail: null,
      };

    case GET_AMENITY_DETAIL.SUCCESS:
      return {
        ...state,
        amenityDetail: action.payload,
      };

    case GET_AMENITIES.SUCCESS:
      return {
        ...state,
        amenityList: action.payload.filter((item) => item.isActive),
        amenitiesFilter: transformAmenities(action.payload),
      };

    case GET_ALL_BOOKING_PURPOSE.SUCCESS:
      return {
        ...state,
        bookingPurposes: action.payload,
      };

    default:
      return state;
  }
};
