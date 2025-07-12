import { useStateValue, useHandlerAction } from '../../index';
import NavigationServices from '@NavigationService';
import { RequestApi } from '../../../Services';
import {
  GET_ASSIGNEE_LIST,
  ADD_COMMENT,
  GET_COMMENT_BY_TASK,
  GET_MENTION_USER,
  GET_PRIORITY_LIST,
  GET_STATUS_LIST,
  GET_TASK_LIST,
  GET_TEAMS_BY_TENANT,
  GET_TASK_DETAIL,
  ADD_TASK,
  UPDATE_TASK,
  resetTaskDetailRequest,
  GET_USERS_IN_TEAMS_BY_TENANTS,
  GET_EMPLOYEES_BY_TENANT,
  GET_TEAMS_FOR_TASK_DETAIL,
  GET_TENANTS_TASK_DETAIL,
} from '../Actions';
import { getCacheKey, transformMentionUsers } from '../../../Transforms/TaskMangementTransformer';

const useTaskManagement = () => {
  const [{ taskManagement }, dispatch] = useStateValue();
  const { withLoadingAndErrorHandling, withErrorHandling } = useHandlerAction();

  const getTaskList = async (params) => {
    const response = await RequestApi.getTaskList(params);
    return response;
  };

  const getPriorityList = async () => {
    const response = await RequestApi.getPriorityList();
    return response;
  };

  const getTeamsByTenant = async (params) => {
    const response = await RequestApi.getTMTeamList({ ...params, target: 'TaskManagement', isActive: true });
    return response;
  };

  const getCurrentTeamList = async () => {
    const response = await RequestApi.getTMCurrentTeamList();
    return response;
  };

  const getAssigneeList = async (params) => {
    const response = await RequestApi.getUsersInTeamByTenant(params);
    return response;
  };

  const getUsersInTeamByTenants = async (params) => {
    const response = await RequestApi.getUsersInTeamByTenants(params);
    return response;
  };

  const getTaskDetail = async (taskId) => {
    const response = await RequestApi.getTaskDetail(taskId);
    return response;
  };

  const addTask = async (payload) => {
    const { files } = payload;
    const response = await RequestApi.addTask(payload);
    if (files.length > 0) {
      await RequestApi.uploadTaskManagementFiles(response.guid, payload.tenantId, files);
    }
    NavigationServices.goBack();
    return response;
  };

  const updateTask = async (payload) => {
    const { files } = payload;
    const response = await RequestApi.updateTask(payload);
    if (files.length > 0) {
      await RequestApi.uploadTaskManagementFiles(response.guid, payload.tenantId, files);
    }
    NavigationServices.goBack();
    return response;
  };

  const getStatusList = async () => {
    const response = await RequestApi.getStatusList();
    return response;
  };

  const getMentionUsers = async (params) => {
    const response = await RequestApi.getMentionUsers(params);
    return { mentionUsers: transformMentionUsers(response), key: getCacheKey(params) };
  };

  const addComment = async (params) => {
    const response = await RequestApi.addComment(params);
    return response;
  };

  const getCommentByTask = async (params) => {
    const response = await RequestApi.getCommentByTask(params);
    return response;
  };

  const resetTaskDetail = async () => {
    dispatch(resetTaskDetailRequest());
  };

  const getEmployeesByTenant = async (params) => {
    const response = await RequestApi.getListEmployeesByTenant(params);
    return response;
  };

  const getTeamsForTaskDetail = async (params) => {
    const response = await RequestApi.getTMTeamList({ ...params, target: 'TaskManagement', isActive: true });
    return response;
  };

  const getTenantsTaskDetail = async (params) => {
    const response = await RequestApi.getTenantList({
      ...params,
      editionIdSpecified: false,
      skipCount: 0,
    });
    return response;
  }

  return {
    taskManagement,
    getTaskList: withErrorHandling(GET_TASK_LIST, getTaskList),
    getStatusList: withErrorHandling(GET_STATUS_LIST, getStatusList),
    getPriorityList: withErrorHandling(GET_PRIORITY_LIST, getPriorityList),
    getTeamsByTenant: withErrorHandling(GET_TEAMS_BY_TENANT, getTeamsByTenant),
    getCurrentTeamList: withErrorHandling(GET_TEAMS_BY_TENANT, getCurrentTeamList),
    getAssigneeList: withErrorHandling(GET_ASSIGNEE_LIST, getAssigneeList),
    getTaskDetail: withLoadingAndErrorHandling(GET_TASK_DETAIL, getTaskDetail),
    addTask: withLoadingAndErrorHandling(ADD_TASK, addTask),
    updateTask: withLoadingAndErrorHandling(UPDATE_TASK, updateTask),
    getMentionUsers: withErrorHandling(GET_MENTION_USER, getMentionUsers),
    addComment: withLoadingAndErrorHandling(ADD_COMMENT, addComment),
    getCommentByTask: withLoadingAndErrorHandling(GET_COMMENT_BY_TASK, getCommentByTask),
    getUsersInTeamByTenants: withErrorHandling(GET_USERS_IN_TEAMS_BY_TENANTS, getUsersInTeamByTenants),
    getEmployeesByTenant: withErrorHandling(GET_EMPLOYEES_BY_TENANT, getEmployeesByTenant),
    getTeamsForTaskDetail: withErrorHandling(GET_TEAMS_FOR_TASK_DETAIL, getTeamsForTaskDetail),
    getTenantsTaskDetail: withErrorHandling(GET_TENANTS_TASK_DETAIL, getTenantsTaskDetail),
    resetTaskDetail,
  };
};

export default useTaskManagement;
