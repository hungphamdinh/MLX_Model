
export const GET_PROPERTIES_REQUEST = 'property/GET_PROPERTIES_REQUEST';
export const GET_PROPERTIES_SUCCESS = 'property/GET_PROPERTIES_SUCCESS';
export const GET_PROPERTIES_FAILURE = 'property/GET_PROPERTIES_FAILURE';

export const GET_OFFLINE_PROPERTIES_REQUEST = 'property/GET_OFFLINE_PROPERTIES_REQUEST';
export const GET_OFFLINE_PROPERTIES_SUCCESS = 'property/GET_OFFLINE_PROPERTIES_SUCCESS';
export const GET_OFFLINE_PROPERTIES_FAILURE = 'property/GET_OFFLINE_PROPERTIES_FAILURE';

export const GET_PROPERTY_TYPES_SUCCESS = 'property/GET_PROPERTY_TYPES_SUCCESS';

export const CREATE_PROPERTY_REQUEST = 'property/CREATE_PROPERTY_REQUEST';
export const CREATE_PROPERTY_SUCCESS = 'property/CREATE_PROPERTY_SUCCESS';
export const CREATE_PROPERTY_FAILURE = 'property/CREATE_PROPERTY_FAILURE';

export const UPDATE_PROPERTY_REQUEST = 'property/UPDATE_PROPERTY_REQUEST';
export const UPDATE_PROPERTY_SUCCESS = 'property/UPDATE_PROPERTY_SUCCESS';
export const UPDATE_PROPERTY_FAILURE = 'property/UPDATE_PROPERTY_FAILURE';

export const DELETE_PROPERTY_REQUEST = 'property/DELETE_PROPERTY_REQUEST';
export const DELETE_PROPERTY_SUCCESS = 'property/DELETE_PROPERTY_SUCCESS';
export const DELETE_PROPERTY_FAILURE = 'property/DELETE_PROPERTY_FAILURE';

export const UPLOAD_PROPERTY_PHOTO_REQUEST = 'property/UPLOAD_PROPERTY_PHOTO_REQUEST';
export const UPLOAD_PROPERTY_PHOTO_SUCCESS = 'property/UPLOAD_PROPERTY_PHOTO_SUCCESS';
export const UPLOAD_PROPERTY_PHOTO_FAILURE = 'property/UPLOAD_PROPERTY_PHOTO_FAILURE';


export const GET_PROPERTY_DETAIL_REQUEST = 'property/GET_PROPERTY_DETAIL_REQUEST';
export const GET_PROPERTY_DETAIL_SUCCESS = 'property/GET_PROPERTY_DETAIL_SUCCESS';
export const GET_PROPERTY_DETAIL_FAILURE = 'property/GET_PROPERTY_DETAIL_FAILURE';

export const GET_ALL_PROPERTY_UNIT_TYPE_REQUEST = 'property/GET_ALL_PROPERTY_UNIT_TYPE_REQUEST';
export const GET_ALL_PROPERTY_UNIT_TYPE_SUCCESS = 'property/GET_ALL_PROPERTY_UNIT_TYPE_SUCCESS';
export const GET_ALL_PROPERTY_UNIT_TYPE_FAILURE = 'property/GET_ALL_PROPERTY_UNIT_TYPE_FAILURE';

export const GET_ALL_PROPERTY_BUILDING_TYPE_REQUEST = 'property/GET_ALL_PROPERTY_BUILDING_TYPE_REQUEST';
export const GET_ALL_PROPERTY_BUILDING_TYPE_SUCCESS = 'property/GET_ALL_PROPERTY_BUILDING_TYPE_SUCCESS';
export const GET_ALL_PROPERTY_BUILDING_TYPE_FAILURE = 'property/GET_ALL_PROPERTY_BUILDING_TYPE_FAILURE';

export const GET_TEAM_PROPERTIES_REQUEST = 'property/GET_TEAM_PROPERTIES_REQUEST';
export const GET_TEAM_PROPERTIES_SUCCESS = 'property/GET_TEAM_PROPERTIES_SUCCESS';
export const GET_TEAM_PROPERTIES_FAILURE = 'property/GET_TEAM_PROPERTIES_FAILURE';

export const GET_DISTRICTS_REQUEST = 'property/GET_DISTRICTS_REQUEST';
export const GET_DISTRICTS_SUCCESS = 'property/GET_DISTRICTS_SUCCESS';
export const GET_DISTRICTS_FAILURE = 'property/GET_DISTRICTS_FAILURE';

export const GET_PROPERTY_SETTINGS_REQUEST = 'property/GET_PROPERTY_SETTINGS_REQUEST';
export const GET_PROPERTY_SETTINGS_SUCCESS = 'property/GET_PROPERTY_SETTINGS_SUCCESS';
export const GET_PROPERTY_SETTINGS_FAILURE = 'property/GET_PROPERTY_SETTINGS_FAILURE';

export const UPLOAD_PROPERTY_IMAGE = 'property/UPLOAD_PROPERTY_IMAGE';
export const CLEAR_PROPERTY_DETAIL = 'property/CLEAR_PROPERTY_DETAIL';

export const GET_PROPERTIES_TO_SELECT_REQUEST = 'property/GET_PROPERTIES_TO_SELECT_REQUEST';
export const GET_PROPERTIES_TO_SELECT_SUCCESS = 'property/GET_PROPERTIES_TO_SELECT_SUCCESS';
export const GET_PROPERTIES_TO_SELECT_FAILURE = 'property/GET_PROPERTIES_TO_SELECT_FAILURE';

export const getPropertiesRequest = payload => ({
  type: GET_PROPERTIES_REQUEST,
  payload,
});

export const getPropertiesSuccess = payload => ({
  type: GET_PROPERTIES_SUCCESS,
  payload,
});

export const getPropertiesFailure = payload => ({
  type: GET_PROPERTIES_FAILURE,
  payload,
});


export const getOfflinePropertiesRequest = payload => ({
  type: GET_OFFLINE_PROPERTIES_REQUEST,
  payload,
});

export const getOfflinePropertiesSuccess = payload => ({
  type: GET_OFFLINE_PROPERTIES_SUCCESS,
  payload,
});

export const getOfflinePropertiesFailure = payload => ({
  type: GET_OFFLINE_PROPERTIES_FAILURE,
  payload,
});

export const uploadPropertyImage = payload => ({
  type: UPLOAD_PROPERTY_IMAGE,
  payload,
});

export const getPropertyTypesSuccess = payload => ({
  type: GET_PROPERTY_TYPES_SUCCESS,
  payload,
});

export const getDetailPropertyRequest = payload => ({
  type: GET_PROPERTY_DETAIL_REQUEST,
  payload,
});

export const getDetailPropertySuccess = payload => ({
  type: GET_PROPERTY_DETAIL_SUCCESS,
  payload,
});

export const getDetailPropertyFailure = payload => ({
  type: GET_PROPERTY_DETAIL_FAILURE,
  payload,
});


export const createPropertyRequest = payload => ({
  type: CREATE_PROPERTY_REQUEST,
  payload,
});

export const createPropertySuccess = payload => ({
  type: CREATE_PROPERTY_SUCCESS,
  payload,
});

export const createPropertyFailure = payload => ({
  type: CREATE_PROPERTY_FAILURE,
  payload,
});


export const updatePropertyRequest = payload => ({
  type: UPDATE_PROPERTY_REQUEST,
  payload,
});

export const updatePropertySuccess = payload => ({
  type: UPDATE_PROPERTY_SUCCESS,
  payload,
});

export const updatePropertyFailure = payload => ({
  type: UPDATE_PROPERTY_FAILURE,
  payload,
});


export const deletePropertyRequest = payload => ({
  type: DELETE_PROPERTY_REQUEST,
  payload,
});

export const deletePropertySuccess = payload => ({
  type: DELETE_PROPERTY_SUCCESS,
  payload,
});

export const deletePropertyFailure = payload => ({
  type: DELETE_PROPERTY_FAILURE,
  payload,
});


export const uploadPropertyPhotoRequest = payload => ({
  type: UPLOAD_PROPERTY_PHOTO_REQUEST,
  payload,
});

export const uploadPropertyPhotoSuccess = payload => ({
  type: UPLOAD_PROPERTY_PHOTO_SUCCESS,
  payload,
});

export const uploadPropertyPhotoFailure = payload => ({
  type: UPLOAD_PROPERTY_PHOTO_FAILURE,
  payload,
});

export const getAllPropertyUnitTypeRequest = payload => ({
  type: GET_ALL_PROPERTY_UNIT_TYPE_REQUEST,
  payload,
});

export const getAllPropertyUnitTypeSuccess = payload => ({
  type: GET_ALL_PROPERTY_UNIT_TYPE_SUCCESS,
  payload,
});

export const getAllPropertyUnitTypeFailure = payload => ({
  type: GET_ALL_PROPERTY_UNIT_TYPE_FAILURE,
  payload,
});

export const getAllPropertyBuildingTypeRequest = payload => ({
  type: GET_ALL_PROPERTY_BUILDING_TYPE_REQUEST,
  payload,
});

export const getAllPropertyBuildingTypeSuccess = payload => ({
  type: GET_ALL_PROPERTY_BUILDING_TYPE_SUCCESS,
  payload,
});

export const getAllPropertyBuildingTypeFailure = payload => ({
  type: GET_ALL_PROPERTY_BUILDING_TYPE_FAILURE,
  payload,
});

export const getTeamPropertiesRequest = payload => ({
  type: GET_TEAM_PROPERTIES_REQUEST,
  payload,
});

export const getTeamPropertiesSuccess = payload => ({
  type: GET_TEAM_PROPERTIES_SUCCESS,
  payload,
});

export const getTeamPropertiesFailure = payload => ({
  type: GET_TEAM_PROPERTIES_FAILURE,
  payload,
});


export const getDistrictsRequest = payload => ({
  type: GET_DISTRICTS_REQUEST,
  payload,
});

export const getDistrictsSuccess = payload => ({
  type: GET_DISTRICTS_SUCCESS,
  payload,
});

export const getDistrictsFailure = payload => ({
  type: GET_DISTRICTS_FAILURE,
  payload,
});

export const getPropertySettingsRequest = payload => ({
  type: GET_PROPERTY_SETTINGS_REQUEST,
  payload,
});

export const getPropertySettingsSuccess = payload => ({
  type: GET_PROPERTY_SETTINGS_SUCCESS,
  payload,
});

export const getPropertySettingsFailure = payload => ({
  type: GET_PROPERTY_SETTINGS_FAILURE,
  payload,
});

export const clearPropertyDetail = () => ({
  type: CLEAR_PROPERTY_DETAIL,
});

export const getPropertiesToSelectRequest = payload => ({
  type: GET_PROPERTIES_TO_SELECT_REQUEST,
  payload,
});

export const getPropertiesToSelectSuccess = payload => ({
  type: GET_PROPERTIES_TO_SELECT_SUCCESS,
  payload,
});

export const getPropertiesToSelectFailure = payload => ({
  type: GET_PROPERTIES_TO_SELECT_FAILURE,
  payload,
});
