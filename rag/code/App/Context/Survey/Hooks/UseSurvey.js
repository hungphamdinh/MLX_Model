import { useState } from 'react';
import NavigationService from '@NavigationService';
import I18n from '@I18n';
import { DeviceEventEmitter } from 'react-native';
import _ from 'lodash';
import { useHandlerAction, useStateValue } from '../../index';
import {
  addSurveyFailure,
  addSurveyRequest,
  addSurveySuccess,
  FILTER_SURVEY_UNITS,
  filterExistingSurveyFailure,
  filterExistingSurveyRequest,
  filterExistingSurveySuccess,
  filterSurveyFailure,
  filterSurveyRequest,
  filterSurveyResponseFailure,
  filterSurveyResponseRequest,
  filterSurveyResponseSuccess,
  filterSurveySuccess,
  filterSurveyUsersFailure,
  filterSurveyUsersRequest,
  filterSurveyUsersSuccess,
  getEmailMembersForPublishFailure,
  getEmailMembersForPublishRequest,
  getEmailMembersForPublishSuccess,
  getListEmployeeForPublishFailure,
  getListEmployeeForPublishRequest,
  getListEmployeeForPublishSuccess,
  getListUnitsForPublishFailure,
  getListUnitsForPublishRequest,
  getListUnitsForPublishSuccess,
  getOptionsForPublishSurveyFailure,
  getOptionsForPublishSurveyRequest,
  getOptionsForPublishSurveySuccess,
  getSurveyDetailFailure,
  getSurveyDetailRequest,
  getSurveyDetailSuccess,
  publicSurveyFailure,
  publicSurveyRequest,
  publicSurveySuccess,
  updateSurveyTitleFailure,
  updateSurveyTitleRequest,
  updateSurveyTitleSuccess,
  uploadSurveySignatureFailure,
  uploadSurveySignatureRequest,
  uploadSurveySignatureSuccess,
} from '../Actions';
import { RequestApi } from '../../../Services';
import { transformListUnitTypes, transformTenantRoles } from '../../../Transforms/SurveyTransformer';
import { modal } from '../../../Utils';
import { getLiveFiles } from '../../../Services/FileService';
import { transformBuildings } from '../../../Transforms/HomeTransformer';

const useSurvey = () => {
  const [{ survey }, dispatch] = useStateValue();
  const [isLoading, setIsLoading] = useState(false);
  const { withErrorHandling } = useHandlerAction();

  const filterExistingSurvey = async (params) => {
    try {
      dispatch(filterExistingSurveyRequest(params));
      const response = await RequestApi.filterSurvey(params);
      dispatch(filterExistingSurveySuccess(response));
    } catch (err) {
      dispatch(filterExistingSurveyFailure(err));
    }
  };

  const filterSurvey = async (params) => {
    try {
      dispatch(filterSurveyRequest(params));
      const response = await RequestApi.filterSurvey(params);
      dispatch(filterSurveySuccess(response));
    } catch (err) {
      dispatch(filterSurveyFailure(err));
    }
  };

  const getSurveyDetail = async (params) => {
    try {
      setIsLoading(true);
      dispatch(getSurveyDetailRequest(params));
      const response = await RequestApi.getSurveyDetail(params);
      dispatch(getSurveyDetailSuccess(response));
    } catch (err) {
      dispatch(getSurveyDetailFailure(err));
    } finally {
      setIsLoading(false);
    }
  };

  const filterSurveyUsers = async (params) => {
    try {
      dispatch(filterSurveyUsersRequest(params));
      const response = await RequestApi.filterSurveyUsers(params);
      dispatch(filterSurveyUsersSuccess(response));
    } catch (err) {
      dispatch(filterSurveyUsersFailure(err));
    }
  };

  const filterSurveyResponse = async (params) => {
    try {
      dispatch(filterSurveyResponseRequest(params));
      const response = await RequestApi.filterSurveyResponse(params);
      dispatch(filterSurveyResponseSuccess(response));
    } catch (err) {
      dispatch(filterSurveyResponseFailure(err));
    }
  };

  const addSurvey = async (params) => {
    try {
      setIsLoading(true);
      dispatch(addSurveyRequest(params));
      const response = await RequestApi.addSurvey(params);
      dispatch(addSurveySuccess(response));
      DeviceEventEmitter.emit('SurveyDashboardUpdated');
      // navigate to detail screen
      getSurveyDetail(response.id);
      NavigationService.navigate('surveyDetail');
    } catch (err) {
      dispatch(addSurveyFailure(err));
    } finally {
      setIsLoading(false);
    }
  };

  const updateSurveyTitle = async (params) => {
    try {
      setIsLoading(true);
      dispatch(updateSurveyTitleRequest(params));
      await RequestApi.updateSurveyTitle(params);
      NavigationService.goBack();

      dispatch(updateSurveyTitleSuccess(params.name));
    } catch (err) {
      dispatch(updateSurveyTitleFailure(err));
    } finally {
      setIsLoading(false);
    }
  };

  const getOptionsForPublishSurvey = async () => {
    try {
      setIsLoading(true);
      dispatch(getOptionsForPublishSurveyRequest());
      const buildings = await RequestApi.getBuildings();
      const types = await RequestApi.getListCatType();
      const unitTypes = types.filter((item) => item.target === 'UNIT-TYPE');
      const tenantRoles = types.filter((item) => item.target === 'MEMBER-ROLE');

      dispatch(
        getOptionsForPublishSurveySuccess({
          buildings: transformBuildings(buildings),
          unitTypes: transformListUnitTypes(unitTypes),
          tenantRoles: transformTenantRoles(tenantRoles),
        })
      );
    } catch (err) {
      dispatch(getOptionsForPublishSurveyFailure(err));
    } finally {
      setIsLoading(false);
    }
  };

  const getListUnitsForPublish = async (params) => {
    try {
      setIsLoading(true);
      dispatch(getListUnitsForPublishRequest(params));
      const result = await RequestApi.getListUnitsV1(params);
      if (result.length === 0) {
        // toast.showError(I18n.t('SURVEY_NOT_FOUND_A_PUBLISH_RECORD'));
        modal.showError(I18n.t('SURVEY_NOT_FOUND_A_PUBLISH_RECORD'));

        throw new Error(I18n.t('SURVEY_NOT_FOUND_A_PUBLISH_RECORD'));
      }
      dispatch(getListUnitsForPublishSuccess(result));
      return result;
    } catch (err) {
      dispatch(getListUnitsForPublishFailure(err));
    } finally {
      setIsLoading(false);
    }
    return null;
  };

  const getEmailMembersForPublish = async (params) => {
    try {
      setIsLoading(true);
      dispatch(getEmailMembersForPublishRequest(params));
      const result = await RequestApi.getEmailMemberV1(params);
      if (result.length === 0) {
        // toast.showError(I18n.t('SURVEY_NOT_FOUND_A_PUBLISH_RECORD'));
        modal.showError(I18n.t('SURVEY_NOT_FOUND_A_PUBLISH_RECORD'));

        throw new Error(I18n.t('SURVEY_NOT_FOUND_A_PUBLISH_RECORD'));
      }
      dispatch(getEmailMembersForPublishSuccess(result));
      return result;
    } catch (err) {
      dispatch(getEmailMembersForPublishFailure(err));
    } finally {
      setIsLoading(false);
    }
    return null;
  };

  const getListEmployeeForPublish = async (params) => {
    try {
      setIsLoading(true);
      dispatch(getListEmployeeForPublishRequest(params));
      const result = await RequestApi.getListEmployees();
      if (result.items.length === 0) {
        // toast.showError(I18n.t('SURVEY_NOT_FOUND_A_PUBLISH_RECORD'));
        modal.showError(I18n.t('SURVEY_NOT_FOUND_A_PUBLISH_RECORD'));
        throw new Error(I18n.t('SURVEY_NOT_FOUND_A_PUBLISH_RECORD'));
      }
      dispatch(getListEmployeeForPublishSuccess(_.get(result, 'items', [])));
      return result;
    } catch (err) {
      dispatch(getListEmployeeForPublishFailure(err));
    } finally {
      setIsLoading(false);
    }
    return null;
  };

  const publicSurvey = async (params) => {
    try {
      setIsLoading(true);
      dispatch(publicSurveyRequest(params));
      const result = await RequestApi.publicSurvey(params);
      dispatch(publicSurveySuccess(result));
      getSurveyDetail(params.id);
      NavigationService.navigate('surveyDetail');
      DeviceEventEmitter.emit('SurveyDashboardUpdated');
    } catch (err) {
      dispatch(publicSurveyFailure(err));
    } finally {
      setIsLoading(false);
    }
  };

  const uploadSurveySignature = async (params) => {
    setIsLoading(true);
    dispatch(uploadSurveySignatureRequest(params));
    try {
      const { files, referenceId } = params;
      const fileLive = await getLiveFiles(files);
      if (fileLive.existedFiles.length > 0 && fileLive.notFounds.length === 0) {
        const response = await RequestApi.uploadSurveySignature(files, referenceId);
        if (response) {
          dispatch(uploadSurveySignatureSuccess([]));
        }
      }
    } catch (err) {
      dispatch(uploadSurveySignatureFailure(err));
    } finally {
      setIsLoading(false);
    }
  };

  const filterSurveyUnits = async (params) => {
    const results = await RequestApi.filterSurveyUnits(params);
    return results;
  };

  return {
    survey,
    isLoading,
    filterSurvey,
    getSurveyDetail,
    filterSurveyUsers,
    filterSurveyResponse,
    filterExistingSurvey,
    updateSurveyTitle,
    addSurvey,
    getOptionsForPublishSurvey,
    getListUnitsForPublish,
    getEmailMembersForPublish,
    getListEmployeeForPublish,
    publicSurvey,
    uploadSurveySignature,
    filterSurveyUnits: withErrorHandling(FILTER_SURVEY_UNITS, filterSurveyUnits),
  };
};

export default useSurvey;
