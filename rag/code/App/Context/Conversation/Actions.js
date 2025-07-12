export const GET_USER_COMMENTS_REQUEST = 'conversation/GET_USER_COMMENTS_REQUEST';
export const GET_USER_COMMENTS_SUCCESS = 'conversation/GET_USER_COMMENTS_SUCCESS';
export const GET_USER_COMMENTS_FAILURE = 'conversation/GET_USER_COMMENTS_FAILURE';

export const GET_ADMIN_COMMENTS_REQUEST = 'conversation/GET_ADMIN_COMMENTS_REQUEST';
export const GET_ADMIN_COMMENTS_SUCCESS = 'conversation/GET_ADMIN_COMMENTS_SUCCESS';
export const GET_ADMIN_COMMENTS_FAILURE = 'conversation/GET_ADMIN_COMMENTS_FAILURE';

export const GET_COMMENTS_UNREAD_REQUEST = 'conversation/GET_COMMENTS_UNREAD_REQUEST';
export const GET_COMMENTS_UNREAD_SUCCESS = 'conversation/GET_COMMENTS_UNREAD_SUCCESS';
export const GET_COMMENTS_UNREAD_FAILURE = 'conversation/GET_COMMENTS_UNREAD_FAILURE';

export const ADD_COMMENTS_REQUEST = 'conversation/ADD_COMMENTS_REQUEST';
export const ADD_COMMENTS_SUCCESS = 'conversation/ADD_COMMENTS_SUCCESS';
export const ADD_COMMENTS_FAILURE = 'conversation/ADD_COMMENTS_FAILURE';

export const getUserCommentsRequest = (payload) => ({
  type: GET_USER_COMMENTS_REQUEST,
  payload,
});

export const getUserCommentsSuccess = (payload) => ({
  type: GET_USER_COMMENTS_SUCCESS,
  payload,
});

export const getUserCommentsFailure = (payload) => ({
  type: GET_USER_COMMENTS_FAILURE,
  payload,
});

export const getAdminCommentsRequest = (payload) => ({
  type: GET_ADMIN_COMMENTS_REQUEST,
  payload,
});

export const getAdminCommentsSuccess = (payload) => ({
  type: GET_ADMIN_COMMENTS_SUCCESS,
  payload,
});

export const getAdminCommentsFailure = (payload) => ({
  type: GET_ADMIN_COMMENTS_FAILURE,
  payload,
});


export const getCommentsUnreadRequest = (payload) => ({
  type: GET_COMMENTS_UNREAD_REQUEST,
  payload,
});

export const getCommentsUnreadSuccess = (payload) => ({
  type: GET_COMMENTS_UNREAD_SUCCESS,
  payload,
});

export const getCommentsUnreadFailure = (payload) => ({
  type: GET_COMMENTS_UNREAD_FAILURE,
  payload,
});

export const addCommentsRequest = (payload) => ({
  type: ADD_COMMENTS_REQUEST,
  payload,
});

export const addCommentsSuccess = (payload) => ({
  type: ADD_COMMENTS_SUCCESS,
  payload,
});

export const addCommentsFailure = (payload) => ({
  type: ADD_COMMENTS_FAILURE,
  payload,
});
