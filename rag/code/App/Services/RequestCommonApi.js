/* @flow */
import CreateApi from './CreateApi';
import APIConfig from '../Config/apiConfig';

const api = CreateApi(APIConfig.apiCommon, false, true);

export default {
  getHeader: (key: string) => api.getHeader(key),
  setHeader: (key: string, value: string) => {
    api.setHeader(key, value);
  },
  setBaseURL: (uri: string) => {
    api.setBaseURL(uri);
  },

  requestCommentUser: (conversationId) =>
    api.get(`/api/conversations?conversationId=${conversationId}&isPrivate=false`),

  requestCommentAdmin: (conversationId) =>
    api.get(`/api/conversations?conversationId=${conversationId}&isPrivate=true`),

  requestAddComment: (params) => api.post('/api/conversations/admin', { ...params }),
};
