/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import _ from 'lodash';
import { DeviceEventEmitter } from 'react-native';
import { useHandlerAction, useStateValue } from '../../index';
import {
  cloneFromGlobalFailure,
  cloneFromGlobalRequest,
  cloneFromGlobalSuccess,
  cloneMyFormFailure,
  cloneMyFormRequest,
  cloneMyFormSuccess,
  createOrEditFormFailure,
  createOrEditFormRequest,
  createOrEditFormSuccess,
  deleteFormFailure,
  deleteFormRequest,
  deleteFormSuccess,
  getDefineSectionsFailure,
  getDefineSectionsRequest,
  getDefineSectionsSuccess,
  getDetailSectionFailure,
  getDetailSectionRequest,
  getDetailSectionSuccess,
  getFormCategoriesFailure,
  getFormCategoriesRequest,
  getFormCategoriesSuccess,
  getFormSettingFailure,
  getFormSettingRequest,
  getFormSettingSuccess,
  getGlobalFormsFailure,
  getGlobalFormsRequest,
  getGlobalFormsSuccess,
  getMyFormsFailure,
  getMyFormsRequest,
  getMyFormsSuccess,
  getOfflineFormsFailure,
  getOfflineFormsRequest,
  getOfflineFormsSuccess,
  getTeamFormsFailure,
  getTeamFormsRequest,
  getTeamFormsSuccess,
  publicFormFailure,
  publicFormRequest,
  publicFormSuccess,
  publishToGlobalFailure,
  publishToGlobalRequest,
  publishToGlobalSuccess,
  publishToTeamFailure,
  publishToTeamRequest,
  publishToTeamSuccess,
  setActionTypeRequest,
  getAllFormQuestionAnswerTemplateRequest,
  getAllFormQuestionAnswerTemplateSuccess,
  getAllFormQuestionAnswerTemplateFailure,
  filterFormQuestionSummaryRequest,
  filterFormQuestionSummarySuccess,
  filterFormQuestionSummaryFailure,
  addUserAnswerRequest,
  addUserAnswerSuccess,
  addUserAnswerFailure,
  reopenFormUserAnswerRequest,
  reopenFormUserAnswerSuccess,
  reopenFormUserAnswerFailure,
  getUserAnswerRequest,
  getUserAnswerSuccess,
  getUserAnswerFailure,
  getUserAnswerByIdRequest,
  getUserAnswerByIdSuccess,
  getUserAnswerByIdFailure,
  updateUserAnswerRequest,
  updateUserAnswerSuccess,
  updateUserAnswerFailure,
  getFormsLinkModuleRequest,
  getFormsLinkModuleSuccess,
  getFormsLinkModuleFailure,
  unPublishToTeamFailure,
  unPublishToTeamSuccess,
  unPublishToTeamRequest,
  getAllFormsRequest,
  getAllFormsSuccess,
  getAllFormsFailure,
  setFormToNonEditRequest,
  setFormToNonEditSuccess,
  setFormToNonEditFailure,
  getFormDetailAfterDateRequest,
  getFormDetailAfterDateSuccess,
  getFormDetailAfterDateFailure,
  cloneHiddenFormRequest,
  cloneHiddenFormSuccess,
  cloneHiddenFormFailure,
  GET_FORM_PAGE_GROUPS,
  GET_FORM_DETAIL,
  GET_FORM_SETTINGS,
  setFormType,
  UPLOAD_FILE_FORM_QUESTION_ANSWER,
} from '../Actions';
import { RequestApi } from '../../../Services';
import {
  convertSubmitDataFromFormEditor,
  transformFormDetailToEditor,
  transformQuestionEditorToSubmitData,
  transformSubQuestionForAddQuestion,
} from '../../../Transforms/InspectionTransformer';
import { ActionType, Modules } from '../../../Config/Constants';
import FormMgr from '../../../Services/OfflineDB/Mgr/FormMgr';
import { NetWork } from '../../../Utils';
import FormPageMgr from '../../../Services/OfflineDB/Mgr/FormPageMgr';
import FormStatusMgr from '../../../Services/OfflineDB/Mgr/FormStatusMgr';
import {
  transformFormDetailToAnswerForm,
  transformPredefinedSections,
  transformFormPageGroupParams,
  convertFormPageGroups,
  transformIdForEachFormPage,
  mapFormPageToResponse,
  transformFormPageGroupsToEditor,
  convertFormPageGroupsToFormPages,
} from '../../../Transforms/FormTransformer';
import SentryService from '../../../Services/SentryService';
import { handleCacheRequest } from '../../../Utils/network';

const useForm = () => {
  const [{ form }, dispatch] = useStateValue();
  const { withLoadingAndErrorHandling, withLoadingAndToastHandling } = useHandlerAction();

  const setActionType = (payload) => {
    dispatch(setActionTypeRequest(payload));
  };

  const getFormSetting = async () => {
    try {
      dispatch(getFormSettingRequest());
      const response = await RequestApi.getFormSetting();
      dispatch(getFormSettingSuccess(response.isTeamLead));
      return response.isTeamLead;
    } catch (err) {
      dispatch(getFormSettingFailure(err));
      SentryService.captureException(err);
    }
    return false;
  };

  const getFormSettings = async () => {
    const response = await handleCacheRequest(RequestApi.getFormSettings);
    return response;
  };

  const getOfflineForms = async (payload, userId) => {
    try {
      const { page, keyword } = payload;
      dispatch(getOfflineFormsRequest(payload));

      // only  get form with status = publish
      const publicStatus = await FormStatusMgr.getPublicStatus();
      const response = await FormMgr.filterMyForm(page, keyword, publicStatus.id, userId);
      dispatch(getOfflineFormsSuccess(response));
    } catch (err) {
      dispatch(getOfflineFormsFailure(err));
      SentryService.captureException(err);
    }
  };

  const getDefineSections = async () => {
    try {
      dispatch(getDefineSectionsRequest());
      const response = await NetWork.handleOffline(RequestApi.getDefineSections, FormPageMgr.getDefineSections);
      const predefineSections = transformPredefinedSections(response);
      dispatch(getDefineSectionsSuccess(predefineSections));
    } catch (err) {
      dispatch(getDefineSectionsFailure(err));
      SentryService.captureException(err);
    }
  };

  const getAllFormQuestionAnswerTemplate = async () => {
    try {
      dispatch(getAllFormQuestionAnswerTemplateRequest());
      const response = await NetWork.handleCacheRequest(RequestApi.getAllFormQuestionAnswerTemplate);
      const options = _.groupBy(_.orderBy(response, ['id'], ['asc']), 'groupCode');
      dispatch(getAllFormQuestionAnswerTemplateSuccess(options));
    } catch (err) {
      dispatch(getAllFormQuestionAnswerTemplateFailure(err));
      SentryService.captureException(err);
    }
  };

  const getDetailSection = async (id) => {
    try {
      dispatch(getDetailSectionRequest());
      const response = await NetWork.handleOffline(RequestApi.getDetailSection, FormPageMgr.getDetailSection, id);
      dispatch(getDetailSectionSuccess(response));
      return response;
    } catch (err) {
      dispatch(getDetailSectionFailure(err));
      SentryService.captureException(err);
      return null;
    }
  };

  const getMyForms = async (payload) => {
    try {
      dispatch(getMyFormsRequest(payload));
      const requestMyForm = form.isTeamLeader ? RequestApi.filterTeamForm : RequestApi.filterMyForm;
      const response = await requestMyForm(payload);
      dispatch(getMyFormsSuccess(response));
    } catch (err) {
      dispatch(getMyFormsFailure(err));
      SentryService.captureException(err);
    }
  };

  const getFormsByLinkModule = async (payload) => {
    try {
      dispatch(getFormsLinkModuleRequest(payload));
      const response = await RequestApi.filterFormByLinkModule(payload);
      dispatch(getFormsLinkModuleSuccess(response));
    } catch (err) {
      dispatch(getFormsLinkModuleFailure(err));
      SentryService.captureException(err);
    }
  };

  const getTeamForms = async (payload) => {
    try {
      dispatch(getTeamFormsRequest(payload));
      const response = await RequestApi.filterTeamFormPublished(payload);
      dispatch(getTeamFormsSuccess(response));
    } catch (err) {
      dispatch(getTeamFormsFailure(err));
      SentryService.captureException(err);
    }
  };

  const getGlobalForms = async (payload) => {
    try {
      dispatch(getGlobalFormsRequest(payload));
      const response = await RequestApi.filterGlobalForm(payload);
      dispatch(getGlobalFormsSuccess(response));
    } catch (err) {
      dispatch(getGlobalFormsFailure(err));
      SentryService.captureException(err);
    }
  };

  const cloneGlobalForm = async (payload) => {
    try {
      dispatch(cloneFromGlobalRequest(payload));
      const response = await RequestApi.cloneFromGlobal(payload);
      dispatch(cloneFromGlobalSuccess(response));
      return response;
    } catch (err) {
      dispatch(cloneFromGlobalFailure(err));
      SentryService.captureException(err);
    }
    return null;
  };

  const cloneHiddenForm = async (payload) => {
    try {
      dispatch(cloneHiddenFormRequest(payload));
      const response = await RequestApi.cloneHiddenForm(payload);
      dispatch(cloneHiddenFormSuccess(response));
      return response;
    } catch (err) {
      dispatch(cloneHiddenFormFailure(err));
      SentryService.captureException(err);
    }
    return null;
  };

  const cloneMyForm = async (payload) => {
    try {
      dispatch(cloneMyFormRequest(payload));
      const response = await RequestApi.addForm(payload);
      dispatch(cloneMyFormSuccess(response));
      return response;
    } catch (err) {
      dispatch(cloneMyFormFailure(err));
      SentryService.captureException(err);
    }
    return null;
  };

  const publishToGlobal = async (payload) => {
    try {
      dispatch(publishToGlobalRequest(payload));
      const response = await RequestApi.publishToGlobal(payload.formId, payload.isPublish);
      dispatch(publishToGlobalSuccess(response));
      return response;
    } catch (err) {
      dispatch(publishToGlobalFailure(err));
      SentryService.captureException(err);
    }
    return null;
  };

  const publishToTeam = async (payload) => {
    try {
      dispatch(publishToTeamRequest(payload));
      const response = await RequestApi.publishToTeam(payload);
      dispatch(publishToTeamSuccess(response));
      return response;
    } catch (err) {
      dispatch(publishToTeamFailure(err));
      SentryService.captureException(err);
    }
    return null;
  };

  const unPublishToTeam = async (payload) => {
    try {
      dispatch(unPublishToTeamRequest(payload));
      const response = await RequestApi.unPublishToTeam(payload);
      dispatch(unPublishToTeamSuccess(response));
      return response;
    } catch (err) {
      dispatch(unPublishToTeamFailure(err));
      SentryService.captureException(err);
    }
    return null;
  };

  const publicForm = async (payload) => {
    try {
      dispatch(publicFormRequest());
      const { formId, isPublic } = payload;
      let response;
      if (isPublic) {
        response = await RequestApi.publicForm(formId);
      } else {
        response = await RequestApi.unPublicForm(formId);
      }
      dispatch(publicFormSuccess(response));
      return response;
    } catch (err) {
      dispatch(publicFormFailure(err));
      SentryService.captureException(err);
    }
    return null;
  };

  const getFormDetail = async (payload) => {
    const { id, isEditForm } = payload;
    let formPageGroups = [];
    const request = isEditForm ? RequestApi.getFormDetail : RequestApi.getFormDetailForResponse;
    const response = await request(id);
    const result = transformFormDetailToEditor(response);
    if (form.formSettings?.isMasterSection) {
      formPageGroups = await getFormPageGroups({ payload: id });
    }

    return {
      ...result,
      formPageGroups: transformFormPageGroupsToEditor(formPageGroups),
      formPages: convertFormPageGroupsToFormPages(result.formPages, formPageGroups),
    };
  };

  const getFormDetailAfterDate = async (payload) => {
    try {
      dispatch(getFormDetailAfterDateRequest(payload));
      const response = await RequestApi.getFormDetailAfterDate(payload);
      const result = transformFormDetailToEditor(response);
      dispatch(getFormDetailAfterDateSuccess(result));
      return result;
    } catch (err) {
      dispatch(getFormDetailAfterDateFailure(err));
    }
    return null;
  };

  const getFormCategories = async () => {
    dispatch(getFormCategoriesRequest());
    try {
      const response = await RequestApi.getFormCategories();
      dispatch(getFormCategoriesSuccess(response.items));
    } catch (err) {
      dispatch(getFormCategoriesFailure(err));
      SentryService.captureException(err);
    }
  };

  const createOrEditForm = async (formData, originalForm) => {
    dispatch(
      createOrEditFormRequest({
        formData,
        originalForm,
      })
    );
    try {
      const params = convertSubmitDataFromFormEditor(formData, originalForm);
      const { name, formCategoryId, adds: formPageAdds, updates: formPageUpdates, removes: formPageRemoves } = params;
      const formPageGroups = formData.formPageGroups;
      // create
      // add form
      let formId = params.id;

      if (!originalForm) {
        const formResult = await RequestApi.addForm({
          formName: name,
          moduleId: Modules.INSPECTION,
          formCategoryId,
          formGroupId: 1,
        });
        formId = formResult.id;

        // delete tempt form page
        const formPage = _.first(formResult.formPages);
        await RequestApi.deleteFormPage(formPage.id);
      }

      // update form
      if (params.actionType === ActionType.UPDATE) {
        const formResult = await RequestApi.updateForm({
          id: formId,
          formName: name,
          formCategoryId,
        });
        formId = formResult.id;
      }

      // create form pages
      for (const formPage of formPageAdds) {
        const formQuestions = formPage.formQuestions;
        const formPageParams = {
          formId,
          name: formPage.name,
        };
        const formPageResult = await RequestApi.addFormPage(formPageParams);
        formPage.id = formPageResult.id;
        // add questions
        for (const formQuestion of formQuestions) {
          const question = transformQuestionEditorToSubmitData(formQuestion, true);
          const questionParam = {
            ...question,
            formPageId: formPageResult.id,
            subQuestion: transformSubQuestionForAddQuestion(question.subQuestion),
          };
          await RequestApi.addQuestion(questionParam, questionParam?.isCopy);
        }
      }

      // remove form pages
      await Promise.all(formPageRemoves.map(async (formPage) => RequestApi.deleteFormPage(formPage.id)));

      // update form pages
      await Promise.all(
        formPageUpdates.map(async (formPage) => {
          const { adds: questionAdds, updates: questionUpdates, removes: questionRemoves } = formPage;
          if (formPage.actionType === ActionType.UPDATE) {
            const updateFormPageParams = {
              name: formPage.name,
              id: formPage.id,
            };
            await RequestApi.updateFormPage(updateFormPageParams);
            if (formPage.formQuestionTypeCategoryId) {
              await RequestApi.updateFormQuestionTypeCategory({
                id: formPage.id,
                formQuestionTypeCategoryId: formPage.formQuestionTypeCategoryId,
              });
            }
          }

          // handle questions
          // add questions
          for (const formQuestion of questionAdds) {
            const question = transformQuestionEditorToSubmitData(formQuestion, true);
            const questionParam = {
              ...question,
              formPageId: formPage.id,
              subQuestion: transformSubQuestionForAddQuestion(question.subQuestion),
            };

            await RequestApi.addQuestion(questionParam, questionParam?.isCopy);
          }

          // remove questions
          await Promise.all(questionRemoves.map(async (formQuestion) => RequestApi.deleteQuestion(formQuestion.id)));

          // update questions
          await Promise.all(
            questionUpdates.map(async (formQuestion) => {
              const question = transformQuestionEditorToSubmitData(formQuestion);
              if (question.actionType === ActionType.UPDATE) {
                if (question.subQuestion) {
                  question.subQuestion.id = question.subQuestion.remoteId;
                }
                await RequestApi.updateQuestion(question);
              }
            })
          );
        })
      );

      // add FormPageGroups
      let formPageGroupResponse = [];
      const { formPagesExisting, formPagesNotExisting, formPageGroupsAdd } = convertFormPageGroups(formPageGroups);
      if (!formPageGroupsAdd.find((item) => item.formId)) {
        formPageGroupsAdd.forEach((item) => {
          item.formId = formId;
        });
      }
      if (_.size(formPageGroupsAdd)) {
        formPageGroupResponse = await RequestApi.addFormPageGroup(formPageGroupsAdd);
      }

      // update FormPageGroups
      const formPageGroupsCreated = mapFormPageToResponse(formPageGroupResponse, formPagesNotExisting);
      const formPageGroupsUpdate = transformIdForEachFormPage(
        [...formPageUpdates, ...formPageAdds],
        transformFormPageGroupParams(formPagesExisting.concat(formPageGroupsCreated), formData)
      );
      await RequestApi.updateFormPageGroup(formId, formPageGroupsUpdate);

      // sort sections only apply for the update form
      if (originalForm) {
        const sortParams = {
          formId,
          pages: formData.formPages.map((formPage) => ({ formPageId: formPage.id })),
        };
        await RequestApi.sortForm(sortParams);
      }

      dispatch(createOrEditFormSuccess());
      return formId;
    } catch (err) {
      dispatch(createOrEditFormFailure(err));
      SentryService.captureException(err);
    }
    return null;
  };

  const deleteForm = async (id) => {
    dispatch(deleteFormRequest(id));
    try {
      await RequestApi.deleteForm(id);
      dispatch(deleteFormSuccess());
      dispatch(setIsRefreshInspection(true));
    } catch (err) {
      dispatch(deleteFormFailure(err));
      SentryService.captureException(err);
    }
  };

  const filterFormQuestionSummary = async (params) => {
    dispatch(filterFormQuestionSummaryRequest(params));
    try {
      const result = await RequestApi.filterFormQuestionSummary(params);
      dispatch(filterFormQuestionSummarySuccess(result));
    } catch (err) {
      dispatch(filterFormQuestionSummaryFailure(err));
      SentryService.captureException(err);
    }
  };

  const addUserAnswer = async (params) => {
    dispatch(addUserAnswerRequest(params));
    try {
      const response = await RequestApi.addUserAnswer(params);
      dispatch(addUserAnswerSuccess());
      return response;
    } catch (err) {
      dispatch(addUserAnswerFailure(err));
      SentryService.captureException(err);
    }
    return false;
  };

  const updateUserAnswer = async (params) => {
    dispatch(updateUserAnswerRequest(params));
    try {
      await RequestApi.updateUserAnswer(params);
      dispatch(updateUserAnswerSuccess());
      return {};
    } catch (err) {
      dispatch(updateUserAnswerFailure(err));
      SentryService.captureException(err);
    }
    return false;
  };

  const reopenFormUserAnswer = async (params) => {
    dispatch(reopenFormUserAnswerRequest(params));
    try {
      await RequestApi.reopenFormUserAnswer(params);
      dispatch(reopenFormUserAnswerSuccess(params));
      DeviceEventEmitter.emit('EmployeeSurveyUpdated');
    } catch (err) {
      dispatch(reopenFormUserAnswerFailure(err));
      SentryService.captureException(err);
    }
  };

  const getUserAnswer = async (id) => {
    dispatch(getUserAnswerRequest(id));
    try {
      const result = await RequestApi.getUserAnswer(id);
      const formDetail = transformFormDetailToAnswerForm(result.form, result.answers);
      dispatch(getUserAnswerSuccess(formDetail));
      return formDetail;
    } catch (err) {
      dispatch(getUserAnswerFailure(err));
      SentryService.captureException(err);
    }
    return null;
  };
  const getUserAnswerByParentId = async (payload) => {
    dispatch(getUserAnswerByIdRequest(payload));
    try {
      const result = await RequestApi.getUserAnswerByParentId(payload);
      const formDetail = transformFormDetailToAnswerForm(result.form, result.answers);
      const answer = {
        ...formDetail,
        lastModifierUserId: result.lastModifierUserId,
      };
      dispatch(getUserAnswerByIdSuccess(formDetail));
      return answer;
    } catch (err) {
      dispatch(getUserAnswerByIdFailure(err));
      SentryService.captureException(err);
    }
    return null;
  };

  const getAllForms = async (payload) => {
    try {
      dispatch(getAllFormsRequest(payload));
      const requestMyForm = form.isTeamLeader ? RequestApi.filterTeamForm : RequestApi.filterMyForm;
      const myForms = await requestMyForm({
        status: [2],
        ...payload,
      });
      const teamForms = await RequestApi.filterTeamFormPublished(payload);
      const globalForms = await RequestApi.filterGlobalForm(payload);

      dispatch(
        getAllFormsSuccess({
          myForms: myForms.items.map((item) => {
            item.isMyForm = true;
            return item;
          }),
          teamForms: teamForms.items,
          globalForms: globalForms.items,
        })
      );
    } catch (err) {
      dispatch(getAllFormsFailure(err));
      SentryService.captureException(err);
    }
  };

  const setFormToNonEdit = async (id) => {
    dispatch(setFormToNonEditRequest(id));
    try {
      await RequestApi.setFormToNonEdit(id);
      dispatch(setFormToNonEditSuccess());
      return {};
    } catch (err) {
      dispatch(setFormToNonEditFailure(err));
    }
    return false;
  };

  const getFormPageGroups = async ({ payload }) => {
    const response = await RequestApi.getFormPageGroup(payload);
    return response;
  };

  const setInspectionFormType = async (type) => {
    dispatch(setFormType(type));
  };

  const uploadFileFormQuestionAnswers = async (payload) => {
    const response = await RequestApi.uploadFileFormQuestionAnswers(payload.referenceId, payload.file);
    return response;
  };

  return {
    form,
    getOfflineForms,
    getFormCategories,
    createOrEditForm,
    deleteForm,
    getFormSetting,
    getMyForms,
    getTeamForms,
    getGlobalForms,
    cloneGlobalForm,
    publishToGlobal,
    publishToTeam,
    unPublishToTeam,
    cloneMyForm,
    publicForm,
    setActionType,
    getDefineSections,
    getDetailSection,
    getAllFormQuestionAnswerTemplate,
    filterFormQuestionSummary,
    addUserAnswer,
    reopenFormUserAnswer,
    getUserAnswer,
    updateUserAnswer,
    getUserAnswerByParentId,
    getFormsByLinkModule,
    getAllForms,
    setFormToNonEdit,
    getFormDetailAfterDate,
    cloneHiddenForm,
    getFormPageGroups: withLoadingAndErrorHandling(GET_FORM_PAGE_GROUPS, getFormPageGroups),
    getFormDetail: withLoadingAndErrorHandling(GET_FORM_DETAIL, getFormDetail),
    getFormSettings: withLoadingAndErrorHandling(GET_FORM_SETTINGS, getFormSettings),
    setInspectionFormType,
    uploadFileFormQuestionAnswers: withLoadingAndToastHandling(
      UPLOAD_FILE_FORM_QUESTION_ANSWER,
      uploadFileFormQuestionAnswers
    ),
  };
};

export default useForm;
