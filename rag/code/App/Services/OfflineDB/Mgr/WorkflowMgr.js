import withBaseMgr, { fetchRelationAllowNull } from './BaseMgr';
import InspectionMgr from './InspectionMgr';
import FormUserAnswerMgr from './FormUserAnswerMgr';
import { Q } from '@nozbe/watermelondb';
import FormMgr from './FormMgr';
import FormUserAnswerQuestionImageMgr from './FormUserAnswerQuestionImageMgr';
import SignatureImageMgr from './SignatureImageMgr';

const WorkflowMgr = (collection, baseMgr) => ({
  getFullDataForWorkFlows: async (items, totalCount, sortData, haveUnSyncItem) => {
    const statuses = await Promise.all(
      items.map(async (workflow) => {
        const status = await fetchRelationAllowNull(workflow.status);
        if (status) {
          return status.getValue();
        }
        return null;
      })
    );
    const inspections = await Promise.all(
      items.map(async (workflow) => {
        const inspection = await fetchRelationAllowNull(workflow.inspection);
        if (inspection) {
          return inspection.getDetail();
        }
        return null;
      })
    );
    const creatorUserIds = await Promise.all(
      items.map(async (workflow) => {
        const form = FormMgr.collection;
        const data = await form.find(workflow.formGuid);
        return data.creatorUserId;
      })
    );
    let unSyncImagesCounts = [];
    let unSyncSignaturesCounts = [];

    if (haveUnSyncItem) {
      unSyncImagesCounts = await Promise.all(
        items.map(async (workflow) => {
          const count = await FormUserAnswerQuestionImageMgr.collection
            .query(Q.where('path', Q.like('file://%')), Q.where('workflowGuid', Q.eq(workflow.id)))
            .fetchCount();
          return count;
        })
      );
      unSyncSignaturesCounts = await Promise.all(
        items.map(async (workflow) => {
          const count = await SignatureImageMgr.collection
            .query(Q.where('path', Q.notEq('done')), Q.where('workflowGuid', Q.eq(workflow.id)))
            .fetchCount();
          return count;
        })
      );
    }

    const data = items.map((item, index) => {
      const property = inspections[index]?.property;
      const inspectionPropertyName = property
        ? `${property.name}${property.building ? `/ ${property.building}` : ''}`
        : '';

      const team = inspections[index]?.team;
      const teamAssignee = inspections[index]?.teamAssignee;
      const unSyncImagesCount = unSyncImagesCounts[index] || 0;
      const unSyncSignaturesCount = unSyncSignaturesCounts[index] || 0;

      let result = {
        ...item.getValue(),
        status: statuses[index],
        inspection: inspections[index],
        inspectionPropertyName,
        team,
        creatorUserId: parseInt(creatorUserIds[index], 10),
        syncStatus: item._raw._status,
        teamAssignee,
      };
      if (haveUnSyncItem) {
        result = { ...result, unSyncImagesCount, unSyncSignaturesCount };
      }
      return result;
    });

    let newData = data.filter((item) => {
      const showOfflineJobs =
        !item.status?.isIssueClosed || (item.status?.isIssueClosed && item.syncStatus !== 'synced');
      if (item.inspection && showOfflineJobs) {
        return item;
      }
    });
    if (sortData) {
      const key = `${sortData.type}`;
      newData = data.sort((a, b) => {
        if (typeof a[key] === 'string') {
          return sortData.isAsc ? `${a[key]}`.localeCompare(b[key]) : `${b[key]}`.localeCompare(a[key]);
        }
        return sortData.isAsc ? a[key] - b[key] : b[key] - a[key];
      });
    }
    return {
      items: newData,
      totalCount,
    };
  },

  getDetailWorkflow: async (id) => {
    const workflowDetail = await collection.find(id);
    const inspection = InspectionMgr.collection;
    const inspectionData = await inspection.find(workflowDetail.getValue().parentGuid);
    const formAnswer = await FormUserAnswerMgr.getFormAnswerByInspectionId(inspectionData.getValue().id);
    let inspectionProperty = null;
    if (inspectionData) {
      const propertyData = await inspectionData.getValue().property;
      inspectionProperty = propertyData.getValue();
    }

    return {
      ...workflowDetail.getValue(),
      inspectionProperty,
      formAnswer: formAnswer.getValue(),
    };
  },
  getWorkflowByRemoteId: async (remoteId) => baseMgr.queryOne(Q.where('remoteId', Q.eq(remoteId))),
  findWorkFlowByGuid: async (data) => {
    const workflow = await collection.find(data.guid);
    const status = await fetchRelationAllowNull(data.status);
    const inspectionCollection = InspectionMgr.collection;
    const inspection = await inspectionCollection.find(data.parentGuid);
  
    let inspectionProperty = null;
    if (inspection) {
      const propertyData = await inspection.getValue().property;
      inspectionProperty = propertyData ? propertyData.getValue() : null;
    }

    const inspectionPropertyName = inspectionProperty
      ? `${inspectionProperty.name}${inspectionProperty.building ? `/ ${inspectionProperty.building}` : ''}`
      : '';

    const team = inspection?.team || null;
    const teamAssignee = inspection?.teamAssignee || null;

    const form = FormMgr.collection;
    const formData = await form.find(workflow.formGuid);
    const creatorUserId = parseInt(formData.creatorUserId || 0, 10);
    const syncStatus = workflow._raw._status;

    const comprehensiveWorkflow = {
      ...workflow.getValue(),
      status,
      inspection,
      inspectionPropertyName,
      team,
      creatorUserId,
      syncStatus,
      teamAssignee,
    };

    return comprehensiveWorkflow
  },
  getUnsyncWorkflow: async (id) => {
    return baseMgr.queryOne(Q.where('_status', Q.notEq('synced')), Q.where('id', Q.eq(id)));
  },
});
export default withBaseMgr('workflow')(WorkflowMgr);
