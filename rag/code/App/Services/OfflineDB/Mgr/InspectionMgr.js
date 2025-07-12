import { Q } from '@nozbe/watermelondb';
import I18n from '@I18n';
import _ from 'lodash';
import RNFS from 'react-native-fs';
import SyncDB from '../SyncDB';
import withBaseMgr, { fetchRelationAllowNull } from './BaseMgr';
import WorkflowMgr from './WorkflowMgr';
import FormUserAnswerMgr from './FormUserAnswerMgr';
import { modal } from '../../../Utils';
import FormMgr from './FormMgr';
import { transformFormDetailToEditor } from '../../../Transforms/InspectionTransformer';
import { formItemTypes } from '../../../Config/Constants';
import FormUserAnswerQuestionOptionMgr from './FormUserAnswerQuestionOptionMgr';
import FormUserAnswerQuestionMarching from '../Tables/FormUserAnswerQuestionMarching';
import FormUserAnswerQuestionImageMgr from './FormUserAnswerQuestionImageMgr';
import FormUserAnswerQuestionMgr from './FormUserAnswerQuestionMgr';

import SyncMgr from './SyncMgr';
import { DeviceEventEmitter } from 'react-native';

function filterPickedJob(listPickedBy, listLocal) {
  const hashmap = {};
  listLocal.forEach((element) => {
    hashmap[element.remoteId] = element;
  });

  return listLocal.filter((element) => !listPickedBy.includes(element.remoteId));
}

const InspectionMgr = (collection, baseMgr) => ({
  getList: async (data) => {
    const { keyword, inspectionPropertyId, statusIds, sortData, type } = data;
    const queries = [
      Q.or(
        Q.where('subject', Q.like(`%${Q.sanitizeLikeString(keyword)}%`)),
        Q.where('description', Q.like(`%${Q.sanitizeLikeString(keyword)}%`))
      ),
    ];

    if (inspectionPropertyId) {
      // get inspections with inspection property id
      const inspections = await collection.query(Q.where('inspectionPropertyId', inspectionPropertyId));
      const inspectionIds = inspections.map((item) => item.id);
      queries.push(Q.where('parentGuid', Q.oneOf(inspectionIds)));
    }

    if (_.size(statusIds) > 0) {
      queries.push(Q.where('statusId', Q.oneOf(statusIds)));
    }

    const formData = await SyncDB.database
      .get('form')
      .query(Q.where('id', Q.notEq('')))
      .fetch();
    const forms = await Promise.all(
      formData.map(async (form) => {
        const data = await fetchRelationAllowNull(form);
        if (data) {
          return {
            ...data.getValue(),
          };
        }
        return null;
      })
    );
    let formFiltered = forms;
    if (_.isNumber(type)) {
      formFiltered = forms.filter((item) => item.type === type);
    }
    const formIds = formFiltered.map((item) => `${item.guid}`);
    const listQuery = [
      ...queries,
      Q.where('parentGuid', Q.notEq('')),
      Q.where('formGuid', Q.oneOf(formIds)),
      Q.sortBy('created_at', Q.desc),
      Q.sortBy('remoteId', Q.desc), // sorts ascending by `likes`
    ];
    const items = await WorkflowMgr.collection.query(...listQuery).fetch();
    const totalCount = await WorkflowMgr.collection.query(...queries).fetchCount();
    const result = await WorkflowMgr.getFullDataForWorkFlows(items, totalCount, sortData);
    result.items.forEach((workflow) => {
      const form = _.find(forms, (item) => item.guid === workflow.formGuid);
      workflow.form = {
        type: form?.type,
      };
    });
    return result;
  },
  getHomeList: async (statusId) => {
    // // queries.push(Q.where('parentGuid', Q.oneOf(inspectionIds)));
    // const commonQueries = [
    //   Q.where('parentGuid', Q.notEq('')),
    //   Q.sortBy('created_at', Q.desc), // sorts ascending by `likes`
    //   Q.sortBy('remoteId', Q.desc), // sorts ascending by `likes`
    //   Q.skip(0),
    //   Q.take(PAGE_SIZE),
    // ];
    //
    // const newList = await WorkflowMgr.collection.query(Q.where('statusId', statusId), ...commonQueries).fetch();
    // const fullList = await WorkflowMgr.getFullDataForWorkFlows(newList, newList.length);
    // return fullList;
    // return {
    //   completedInspections: fullCompletedList.items,
    //   newInspections: fullNewList.items,
    // };
  },
  /**
   *  1. create inspection
   *  3. create a work flow
   * */
  createInspection: async ({ propertyId, form, user, defaultStatus, ...params }) =>
    SyncDB.action(async () => {
      // create inspection
      if (!defaultStatus) {
        modal.showError(I18n.t('INSPECTION_IN_PROGRESS_STATUS_NOT_EXIST'));
        return;
      }
      const inspection = await baseMgr.create((obj) => {
        obj.inspectionPropertyId = `${propertyId}`;
      });

      // create a workflow
      const workflow = await WorkflowMgr.create((obj) => {
        obj.subject = params.subject;
        obj.formGuid = form.id;
        obj.statusId = defaultStatus.id;
        obj.parentGuid = inspection.id;
        obj.startDate = params.startDate;
        obj.closedDate = params.closedDate;
        obj.dueDate = params.dueDate;
        obj.rescheduleDate = params.rescheduleDate;
        obj.rescheduleRemark = params.rescheduleRemark;
      });
      // create formUserAnswer
      await FormUserAnswerMgr.createInspectionUserAnswer(inspection.id, `${_.get(user, 'id')}`);
      return workflow.getValue();
    }),
  updateInspection: async ({ id, propertyId, parentGuid, ...params }) =>
    SyncDB.action(async () => {
      await baseMgr.update(parentGuid, (obj) => {
        obj.inspectionPropertyId = `${propertyId}`;
      });
      // create a workflow
      const workflow = await WorkflowMgr.update(id, (obj) => {
        obj.subject = params.subject;
        obj.statusId = params.statusId;
        obj.startDate = params.startDate;
        obj.closedDate = params.closedDate;
        obj.dueDate = params.dueDate;
        obj.rescheduleDate = params.rescheduleDate;
        obj.rescheduleRemark = params.rescheduleRemark;
      });
      return workflow.getValue();
    }),
  deleteInspection: async (workflow, formDetail) => {
    const { formPages } = formDetail;
    await SyncDB.action(async () => {
      await WorkflowMgr.remove(workflow.id);
      await baseMgr.remove(workflow.inspection.id);

      const formUserAnswer = await FormUserAnswerMgr.queryOne(Q.where('parentGuid', workflow.parentGuid));
      if (formUserAnswer) {
        await FormUserAnswerMgr.remove(formUserAnswer.id);
      }
      _.forIn(formPages, async (formPage) => {
        _.forIn(formPage.formQuestions, async (formQuestion) => {
          // delete user answer question
          if (formQuestion.uaqId) {
            await FormUserAnswerQuestionMgr.remove(formQuestion.uaqId);
            await FormUserAnswerQuestionMarching.remove(formQuestion.uaqMarchingId);
            const imageNotSync = await SyncMgr.getImagesNotSync(formQuestion.uaqId);

            const questionTypeId = _.get(formQuestion, 'questionType.id');
            // delete options
            // formQuestion.options
            let answerOptions = [];
            if (questionTypeId === formItemTypes.MULTIPLE_CHOICE) {
              answerOptions = formQuestion.uaqOptions;
            }
            if (_.includes([formItemTypes.DROPDOWN, formItemTypes.Option], questionTypeId)) {
              const optionId = _.get(formQuestion, 'uaqDropdownValue.value');
              if (optionId) {
                answerOptions = [optionId];
              }
            }
            if (answerOptions.length > 0) {
              await Promise.all(
                answerOptions.map(async (optionId) => FormUserAnswerQuestionOptionMgr.remove(optionId))
              );
            }
            if (imageNotSync.length > 0) {
              await Promise.all(
                imageNotSync.map(async (image) => {
                  await RNFS.unlink(image.file);
                  return FormUserAnswerQuestionImageMgr.remove(image.id);
                })
              );
            }
          }
        });
      });
      DeviceEventEmitter.emit('ReloadHomeInspections');
    });
  },
  removeUnSyncedInspection: async (listPicked) => {
    const inspections = await SyncDB.database
      .get('inspection')
      .query(Q.where('remoteId', Q.notEq('')))
      .fetch();
    const inspectionData = await Promise.all(
      inspections.map(async (form) => {
        const data = await fetchRelationAllowNull(form);
        if (data) {
          return {
            ...data.getValue(),
          };
        }
        return null;
      })
    );
    const jobsPicked = filterPickedJob(listPicked, inspectionData);

    if (jobsPicked.length > 0) {
      jobsPicked.forEach(async (item) => {
        let workflow = await WorkflowMgr.collection.query(Q.where('parentId', Q.eq(`${item.remoteId}`))).fetch();
        workflow = _.first(workflow).getValue();
        if (workflow) {
          const response = await FormMgr.getFormInspectionDetail(workflow);
          const formData = transformFormDetailToEditor(response);
          await InspectionMgr(collection, baseMgr).deleteInspection(workflow, formData);
        }
      });
    }
  },
});

export default withBaseMgr('inspection')(InspectionMgr);
