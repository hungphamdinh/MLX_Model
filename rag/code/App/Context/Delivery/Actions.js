export const GET_ALL_DELIVERIES_REQUEST = 'delivery/GET_ALL_DELIVERIES_REQUEST';
export const GET_ALL_DELIVERIES_SUCCESS = 'delivery/GET_ALL_DELIVERIES_SUCCESS';
export const GET_ALL_DELIVERIES_FAILURE = 'delivery/GET_ALL_DELIVERIES_FAILURE';

export const DETAIL_DELIVERY_REQUEST = 'delivery/DETAIL_DELIVERY_REQUEST';
export const DETAIL_DELIVERY_SUCCESS = 'delivery/DETAIL_DELIVERY_SUCCESS';
export const DETAIL_DELIVERY_FAILURE = 'delivery/DETAIL_DELIVERY_FAILURE';

export const GET_DELIVERY_TYPES_REQUEST = 'delivery/GET_DELIVERY_TYPES_REQUEST';
export const GET_DELIVERY_TYPES_SUCCESS = 'delivery/GET_DELIVERY_TYPES_SUCCESS';
export const GET_DELIVERY_TYPES_FAILURE = 'delivery/GET_DELIVERY_TYPES_FAILURE';

export const ADD_DELIVERY_REQUEST = 'delivery/ADD_DELIVERY_REQUEST';
export const ADD_DELIVERY_SUCCESS = 'delivery/ADD_DELIVERY_SUCCESS';
export const ADD_DELIVERY_FAILURE = 'delivery/ADD_DELIVERY_FAILURE';

export const UPDATE_DELIVERY_REQUEST = 'delivery/UPDATE_DELIVERY_REQUEST';
export const UPDATE_DELIVERY_SUCCESS = 'delivery/UPDATE_DELIVERY_SUCCESS';
export const UPDATE_DELIVERY_FAILURE = 'delivery/UPDATE_DELIVERY_FAILURE';

export const GET_DELIVERY_STATUS_REQUEST = 'delivery/GET_DELIVERY_STATUS_REQUEST';
export const GET_DELIVERY_STATUS_SUCCESS = 'delivery/GET_DELIVERY_STATUS_SUCCESS';
export const GET_DELIVERY_STATUS_FAILURE = 'delivery/GET_DELIVERY_STATUS_FAILURE';

export const GET_PARCELS_REQUEST = 'delivery/GET_PARCELS_REQUEST';
export const GET_PARCELS_SUCCESS = 'delivery/GET_PARCELS_SUCCESS';
export const GET_PARCELS_FAILURE = 'delivery/GET_PARCELS_FAILURE';

export const GET_TRANSPORT_SERVICE_REQUEST = 'delivery/GET_TRANSPORT_SERVICE_REQUEST';
export const GET_TRANSPORT_SERVICE_SUCCESS = 'delivery/GET_TRANSPORT_SERVICE_SUCCESS';
export const GET_TRANSPORT_SERVICE_FAILURE = 'delivery/GET_TRANSPORT_SERVICE_FAILURE';

export const GET_LIST_UNIT_REQUEST = 'delivery/GET_LIST_UNIT_REQUEST';
export const GET_LIST_UNIT_SUCCESS = 'delivery/GET_LIST_UNIT_SUCCESS';
export const GET_LIST_UNIT_FAILURE = 'delivery/GET_LIST_UNIT_FAILURE';

export const SCAN_PARCEL_RECEIPT_REQUEST = 'delivery/SCAN_PARCEL_RECEIPT_REQUEST';
export const SCAN_PARCEL_RECEIPT_SUCCESS = 'delivery/SCAN_PARCEL_RECEIPT_SUCCESS';
export const SCAN_PARCEL_RECEIPT_FAILURE = 'delivery/SCAN_PARCEL_RECEIPT_FAILURE';

export const GET_LIST_MEMBER_UNIT_REQUEST = 'delivery/GET_LIST_MEMBER_UNIT_REQUEST';
export const GET_LIST_MEMBER_UNIT_SUCCESS = 'delivery/GET_LIST_MEMBER_UNIT_SUCCESS';
export const GET_LIST_MEMBER_UNIT_FAILURE = 'delivery/GET_LIST_MEMBER_UNIT_FAILURE';

export const CHECK_OUT_REQUEST = 'delivery/CHECK_OUT';
export const CHECK_OUT_SUCCESS = 'delivery/CHECK_OUT_SUCCESS';
export const CHECK_OUT_FAILURE = 'delivery/CHECK_OUT_FAILURE';

export const CHECK_OUT_MULTI_REQUEST = 'delivery/CHECK_OUT_MULTI_REQUEST';
export const CHECK_OUT_MULTI_SUCCESS = 'delivery/CHECK_OUT_MULTI_SUCCESS';
export const CHECK_OUT_MULTI_FAILURE = 'delivery/CHECK_OUT_MULTI_FAILURE';

export const GET_PARCELS_IN_UNIT_REQUEST = 'delivery/GET_PARCELS_IN_UNIT_REQUEST';
export const GET_PARCELS_IN_UNIT_SUCCESS = 'delivery/GET_PARCELS_IN_UNIT_SUCCESS';
export const GET_PARCELS_IN_UNIT_FAILURE = 'delivery/GET_PARCELS_IN_UNIT_FAILURE';

export const UPLOAD_SIGNATURE_FAILURE = 'delivery/UPLOAD_SIGNATURE_FAILURE';

export const getAllDeliveriesRequest = (payload) => ({
  type: GET_ALL_DELIVERIES_REQUEST,
  payload,
});

export const getAllDeliveriesSuccess = (payload) => ({
  type: GET_ALL_DELIVERIES_SUCCESS,
  payload,
});

export const getAllDeliveriesFailure = (payload) => ({
  type: GET_ALL_DELIVERIES_FAILURE,
  payload,
});

export const detailDeliveryRequest = (payload) => ({
  type: DETAIL_DELIVERY_REQUEST,
  payload,
});

export const detailDeliverySuccess = (payload) => ({
  type: DETAIL_DELIVERY_SUCCESS,
  payload,
});

export const detailDeliveryFailure = (payload) => ({
  type: DETAIL_DELIVERY_FAILURE,
  payload,
});

export const getDeliveryTypesRequest = (payload) => ({
  type: GET_DELIVERY_TYPES_REQUEST,
  payload,
});

export const getDeliveryTypesSuccess = (payload) => ({
  type: GET_DELIVERY_TYPES_SUCCESS,
  payload,
});

export const getDeliveryTypesFailure = (payload) => ({
  type: GET_DELIVERY_TYPES_FAILURE,
  payload,
});

export const addDeliveryRequest = (payload) => ({
  type: ADD_DELIVERY_REQUEST,
  payload,
});

export const addDeliverySuccess = (payload) => ({
  type: ADD_DELIVERY_SUCCESS,
  payload,
});

export const addDeliveryFailure = (payload) => ({
  type: ADD_DELIVERY_FAILURE,
  payload,
});

export const updateDeliveryRequest = (payload) => ({
  type: UPDATE_DELIVERY_REQUEST,
  payload,
});

export const updateDeliverySuccess = (payload) => ({
  type: UPDATE_DELIVERY_SUCCESS,
  payload,
});

export const updateDeliveryFailure = (payload) => ({
  type: UPDATE_DELIVERY_FAILURE,
  payload,
});

export const getDeliveryStatusRequest = (payload) => ({
  type: GET_DELIVERY_STATUS_REQUEST,
  payload,
});

export const getDeliveryStatusSuccess = (payload) => ({
  type: GET_DELIVERY_STATUS_SUCCESS,
  payload,
});

export const getDeliveryStatusFailure = (payload) => ({
  type: GET_DELIVERY_STATUS_FAILURE,
  payload,
});

export const getListUnitV2 = (payload) => ({
  type: GET_LIST_UNIT_REQUEST,
  payload,
});

export const getListUnitV2Success = (payload) => ({
  type: GET_LIST_UNIT_SUCCESS,
  payload,
});

export const getListUnitV2Failure = (payload) => ({
  type: GET_LIST_UNIT_FAILURE,
  payload,
});

export const getTransportServices = (payload) => ({
  type: GET_LIST_UNIT_REQUEST,
  payload,
});

export const getTransportServicesSuccess = (payload) => ({
  type: GET_TRANSPORT_SERVICE_SUCCESS,
  payload,
});

export const getTransportServicesFailure = (payload) => ({
  type: GET_TRANSPORT_SERVICE_FAILURE,
  payload,
});

export const getListMemberUnit = (payload) => ({
  type: GET_LIST_MEMBER_UNIT_REQUEST,
  payload,
});

export const getListMemberUnitSuccess = (payload) => ({
  type: GET_LIST_MEMBER_UNIT_SUCCESS,
  payload,
});

export const getListMemberUnitFailure = (payload) => ({
  type: GET_LIST_MEMBER_UNIT_FAILURE,
  payload,
});

export const scanParcelReceipt = (payload) => ({
  type: SCAN_PARCEL_RECEIPT_REQUEST,
  payload,
});

export const scanParcelReceiptSuccess = (payload) => ({
  type: SCAN_PARCEL_RECEIPT_SUCCESS,
  payload,
});

export const scanParcelReceiptFailure = (payload) => ({
  type: SCAN_PARCEL_RECEIPT_FAILURE,
  payload,
});

export const checkOutRequest = (payload) => ({
  type: CHECK_OUT_REQUEST,
  payload,
});

export const checkOutRequestSuccess = (payload) => ({
  type: CHECK_OUT_SUCCESS,
  payload,
});

export const checkOutRequestFailure = (payload) => ({
  type: CHECK_OUT_FAILURE,
  payload,
});

export const checkOutMultiRequest = (payload) => ({
  type: CHECK_OUT_MULTI_REQUEST,
  payload,
});

export const checkOutMultiSuccess = (payload) => ({
  type: CHECK_OUT_MULTI_SUCCESS,
  payload,
});

export const checkOutMultiFailure = (payload) => ({
  type: CHECK_OUT_MULTI_FAILURE,
  payload,
});

export const uploadSignatureFailure = (payload) => ({
  type: UPLOAD_SIGNATURE_FAILURE,
  payload,
});

export const getParcelsInUnitRequest = (payload) => ({
  type: GET_PARCELS_IN_UNIT_REQUEST,
  payload,
});

export const getParcelsInUnitSuccess = (payload) => ({
  type: GET_PARCELS_IN_UNIT_SUCCESS,
  payload,
});

export const getParcelsInUnitFailure = (payload) => ({
  type: GET_PARCELS_IN_UNIT_FAILURE,
  payload,
});
