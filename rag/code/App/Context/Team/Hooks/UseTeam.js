import _ from 'lodash';

import { useHandlerAction, useStateValue } from '../../index';
import {
  getAllTeamMembersFailure,
  getAllTeamMembersRequest,
  getAllTeamMembersSuccess,
  getListObserverFailure,
  getListObserverRequest,
  getListObserverSuccess,
  getTeamAttendanceFailure,
  getTeamAttendanceRequest,
  getTeamAttendanceSuccess,
  getTeamInspectionFailure,
  getTeamInspectionRequest,
  getTeamInspectionSuccess,
  getUserInTeamFailure,
  getUserInTeamRequest,
  getUserInTeamSuccess,
  getTeamPMLinkageRequest,
  getTeamPMLinkageSuccess,
  getTeamPMLinkageFailure,
  getTeamsFailure,
  getTeamsRequest,
  getTeamsSuccess,
  GET_TEAMS_BY_USERS,
} from '../Actions';
import { RequestApi } from '../../../Services';
import { NetWork } from '../../../Utils';

const useTeam = () => {
  const [{ team, user }, dispatch] = useStateValue();
  const { withLoadingAndErrorHandling, withErrorHandling } = useHandlerAction();

  const getAllTeamMembers = async (params) => {
    try {
      dispatch(getAllTeamMembersRequest(params));
      const response = await NetWork.handleCacheRequest(RequestApi.filterMemberInTeams, params);
      dispatch(getAllTeamMembersSuccess(response));
    } catch (err) {
      dispatch(getAllTeamMembersFailure(err));
    }
  };

  const getTeams = async (params) => {
    try {
      dispatch(getTeamsRequest(params));
      const teams = await RequestApi.requestGetTeams(params);
      dispatch(getTeamsSuccess({ teams }));
    } catch (err) {
      dispatch(getTeamsFailure(err));
    }
  };

  const getUserInTeam = async (teamId) => {
    try {
      dispatch(getUserInTeamRequest(teamId));
      const response = await RequestApi.requestGetUsersInTeam(teamId);
      dispatch(getUserInTeamSuccess(response));
    } catch (err) {
      dispatch(getUserInTeamFailure(err));
    }
  };

  const getListObserver = async (target) => {
    try {
      dispatch(getListObserverRequest(target));
      const response = await RequestApi.getListObserver(target);
      dispatch(getListObserverSuccess(response));
    } catch (err) {
      dispatch(getListObserverFailure(err));
    }
  };

  const getTeamsInspection = async (payload) => {
    try {
      dispatch(getTeamInspectionRequest(payload));
      const params = {
        isMyTeam: true,
        target: 'InspectionProperty',
        ...payload,
      };
      const inspectionTeams = await RequestApi.requestGetTeams(params);
      const assignedInspectionTeams = inspectionTeams.filter((item) => item.allowAssignInspectionJob);
      const teamLeadIds = inspectionTeams
        .filter((item) => _.findIndex(item.leaders, (leader) => leader.id === user?.user?.id) > -1)
        .map((item) => item.id);

      dispatch(
        getTeamInspectionSuccess({
          assignedInspectionTeams,
          inspectionTeams,
          teams: inspectionTeams,
          teamLeadIds,
        })
      );
    } catch (err) {
      dispatch(getTeamInspectionFailure(err));
    }
  };

  const getTeamsPMLinkage = async (payload) => {
    try {
      dispatch(getTeamPMLinkageRequest(payload));
      const response = await RequestApi.getInspectionLinkageTeams();
      dispatch(getTeamPMLinkageSuccess(response));
    } catch (err) {
      dispatch(getTeamPMLinkageFailure(err));
    }
  };

  const getTeamAttendance = async (params) => {
    try {
      dispatch(getTeamAttendanceRequest(params));
      const response = await RequestApi.getAttendanceTeams(params);
      dispatch(getTeamAttendanceSuccess(response));
    } catch (err) {
      dispatch(getTeamAttendanceFailure(err));
    }
  };


  const getTeamsByUsers = async (payload) => {
    const response = await RequestApi.getTeamsByUsers(payload);
    return response;
  };

  return {
    team,
    getAllTeamMembers,
    getUserInTeam,
    getListObserver,
    getTeamsInspection,
    getTeamAttendance,
    getTeamsPMLinkage,
    getTeams,
    getTeamsByUsers: withErrorHandling(GET_TEAMS_BY_USERS, getTeamsByUsers),
  };
};

export default useTeam;
