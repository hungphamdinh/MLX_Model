import { useState } from 'react';
import { useStateValue } from '../../index';
import { RequestCommonApi } from '../../../Services';
import {
  getUserCommentsSuccess,
  getUserCommentsFailure,
  getUserCommentsRequest,
  addCommentsFailure,
  addCommentsRequest,
  addCommentsSuccess,
  getAdminCommentsRequest,
  getAdminCommentsSuccess,
  getAdminCommentsFailure,
} from '../Actions';
import { handleResponse } from '../../../Utils/Api';
import { DeviceEventEmitter } from 'react-native';

const useConversation = () => {
  const [{ conversation }, dispatch] = useStateValue();
  const [isLoading, setIsLoading] = useState(false);

  const getUserComments = async (id) => {
    setIsLoading(true);
    try {
      dispatch(getUserCommentsRequest(id));
      const res = await RequestCommonApi.requestCommentUser(id);
      dispatch(getUserCommentsSuccess(res));
    } catch (err) {
      dispatch(getUserCommentsFailure(err));
    } finally {
      setIsLoading(false);
    }
  };

  const getAdminComments = async (id) => {
    setIsLoading(true);
    try {
      dispatch(getAdminCommentsRequest(id));
      const res = await RequestCommonApi.requestCommentAdmin(id);
      dispatch(getAdminCommentsSuccess(res));
    } catch (err) {
      dispatch(getAdminCommentsFailure(err));
    } finally {
      setIsLoading(false);
    }
  };

  const addComment = async (payload) => {
    setIsLoading(true);
    try {
      dispatch(addCommentsRequest(payload));
      const response = await RequestCommonApi.requestAddComment(payload);
      if (payload.isPrivate) {
        DeviceEventEmitter.emit('add_admin_comment');
      } else {
        DeviceEventEmitter.emit('add_user_comment', {});
      }

      dispatch(addCommentsSuccess(response));
      return response;
    } catch (err) {
      dispatch(addCommentsFailure(err));
    } finally {
      setIsLoading(false);
    }
    return null;
  };

  return {
    conversation,
    isLoading,
    addComment,
    getUserComments,
    getAdminComments,
  };
};

export default useConversation;
