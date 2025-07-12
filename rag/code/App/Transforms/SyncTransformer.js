/* eslint-disable no-useless-catch */

// for sync

import _ from 'lodash';
import { parseJson } from '../Utils/transformData';
import { generateInspectionUUID } from '../Services/OfflineDB/IDGenerator';

const getSuffixString = (text, length = 2) => {
  const textSize = _.size(text);
  if (textSize > length) {
    return text.substring(textSize - length, textSize);
  }
  return '';
};

/**
 * use guid for id in some tables have ability to insert to db (form, formPage, formQuestion, formUserAnswer, ...etc).
 * the foreign key will be formPageGuid or formGuid
 * the else change id type to string  when sync to server change type of it to number
 * when get data from backend change the field after with suffix Id (eg: formId) change type of it to string
 *
 * */
const transformPullSyncObject = (object, tableName) => {
  const keys = _.keys(object);
  const finalObject = {};
  keys.forEach((key) => {
    const value = object[key];
    if (key === 'id') {
      finalObject.remoteId = object.id;
      if (
        _.includes(
          [
            'form',
            'formPage',
            'formQuestion',
            'inspection',
            'formUserAnswer',
            'formUserAnswerQuestion',
            'workflow',
            'formQuestionAnswer',
            'formUserAnswerQuestionImage',
            'formUserAnswerQuestionOption',
            'signatureImage',
            'formUserAnswerQuestionMarching',
            'formPageGroup',
            'formSubQuestion',
            'formSubQuestionAnswer',
            'formSubUserAnswerQuestion',
            'formSubUserAnswerQuestionOption',
          ],
          tableName
        )
      ) {
        finalObject.id = object.guid || generateInspectionUUID(tableName);
        return;
      }
      finalObject.id = `${object.id}`;
      return;
    }
    if (tableName === 'formQuestion' && key === 'projectTypeId') {
      finalObject[key] = Number(object.projectTypeId);
      return;
    }
    if (tableName === 'signatureImage' && key === 'referenceId') {
      finalObject[key] = object.referenceId.toLowerCase();
      return;
    }
    if (tableName === 'formPage' && key === 'formQuestionTypeCategoryId') {
      finalObject[key] = Number(object.formQuestionTypeCategoryId);
      return;
    }
    if (tableName === 'formUserAnswerQuestionMarching' && key === 'marching') {
      finalObject[key] = `${object.marching}`;
      return;
    }
    if (typeof value === 'object') {
      finalObject[key] = JSON.stringify(value);
      return;
    }
    if (tableName === 'formUserAnswerQuestion' && key === 'declareQuantity') {
      finalObject[key] = `${object.declareQuantity}`;
      return;
    }
    if (tableName === 'formSubQuestion' && key === 'formQuestionId') {
      finalObject[key] = Number(object.formQuestionId);
      return;
    }
    if (tableName === 'formSubQuestion' && key === 'formQuestionTypeId') {
      finalObject[key] = Number(object.formQuestionTypeId);
      return;
    }
    if (tableName === 'formSubQuestionAnswer' && key === 'formSubQuestionId') {
      finalObject[key] = Number(object.formSubQuestionId);
      return;
    }

    // convert value of property have suffix is Id to string, because we need it for access children, relation in watermelon
    // when push changes to backend, we must change this type to number
    const isSuffixId = getSuffixString(key) === 'Id';
    finalObject[key] = isSuffixId ? `${value}` : value;
  });

  return finalObject;
};

/**
 * transformPushSyncObject
 * Remove _status, _changed, id, created_at, updated_at, remoteId
 * Convert ${prefix}Id to number
 * */
const transformPushSyncObject = (object, tableName) => {
  const keys = _.keys(object);
  const finalObject = {};
  keys.forEach((key) => {
    if (_.includes(['_status', '_changed', 'id', 'created_at', 'updated_at', 'remoteId'], key)) {
      return;
    }
    // for formUserAnswerQuestionImage
    if (tableName === 'formUserAnswerQuestionImage') {
      if (_.includes(['path', 'workflowGuid'], key)) {
        return;
      }
      if (key === 'files') {
        finalObject[key] = parseJson(object[key]);
        return;
      }
    }
    // for inspection table
    if (tableName === 'inspection') {
      if (key === 'signature') {
        // skip sync this key, cause we already have it when call upload inspection signature API
        return;
      }
    }
    if (tableName === 'formUserAnswerQuestionMarching') {
      if (key === 'texts') {
        finalObject[key] = parseJson(object[key]);
        return;
      }
      if (key === 'isPhotographTaken' && object[key] === null) {
        delete finalObject[key];
        return;
      }
    }
    const value = object[key];
    const isSuffixId = getSuffixString(key) === 'Id';
    finalObject[key] = isSuffixId ? _.parseInt(value) : value;
  });
  return finalObject;
};

export const transformPullChanges = (data, lastPullAt) => {
  // const createdAnswerQuestion = data.formUserAnswerQuestion.created;
  // const uniqueUsersByID = _.uniqBy(createdAnswerQuestion, 'guid'); // removed if had duplicate id
  // uniqueUsersByID.forEach((item) => {
  //   const items = createdAnswerQuestion.filter(obj => obj.guid === item.guid);
  //   if (_.size(items) > 1) {
  //     console.log('duplicates ', items);
  //   }
  // });

  const keys = _.keys(data);
  const changes = {};
  try {
    keys.forEach((key) => {
      const tableData = data[key];
      const createdData = _.get(tableData, 'created', []);
      const updatedData = _.get(tableData, 'updated', []);
      const deletedData = _.get(tableData, 'deleted', []);

      let created = lastPullAt ? createdData : _.concat(createdData, updatedData);
      let updated = lastPullAt ? updatedData : [];
      // not handling empty with empty guid request
      const emptyGuidItems = created.filter((item) => item.guid === '00000000-0000-0000-0000-000000000000');
      if (_.size(emptyGuidItems) > 0) {
        // console.log(`warning empty Guid Items for table ${key}`, emptyGuidItems);
      }
      created = created.filter((item) => item.guid !== '00000000-0000-0000-0000-000000000000');
      updated = updated.filter((item) => item.guid !== '00000000-0000-0000-0000-000000000000');
      if (key === 'signature') {
        key = 'signatureImage';
      }

      changes[key] = {
        created: _.map(created, (item) => transformPullSyncObject(item, key)),
        updated: _.map(updated, (item) => transformPullSyncObject(item, key)),
        deleted: deletedData,
      };
    });
    // console.log('changes  is ', changes);

    return changes;
  } catch (e) {
    // console.log('transformSyncPullChanges', e);
  }
  return changes;
};

/** *
 * Cause we had changed value of some properties ${prefix}Id to string (watermelon required id must be string)
 * so we must transform again to number with these things. Apply for (created and updated)
 *
 *
 */

const handleTeamData = (item) => {
  if (item.team) {
    item.team = undefined;
  }
  if (item.teamAssignee) {
    item.teamAssignee = undefined;
  }
};

export const transformPushChanges = (data) => {
  // skip signature image table for push sync
  const keys = _.keys(data);
  const changes = {};
  try {
    keys.forEach((key) => {
      const tableData = data[key];
      let createdData = _.get(tableData, 'created', []);
      let updatedData = _.get(tableData, 'updated', []);
      const deletedData = _.get(tableData, 'deleted', []);
      // if (key === 'formUserAnswerQuestionImage') {
      //   // only sync record with empty or done path
      //   // console.log()
      //   createdData = createdData.filter((item) => _.includes(['', 'done'], item.path));
      //   updatedData = updatedData.filter((item) => item.remoteId && _.includes(['', 'done'], item.path));
      // }
      if (key === 'formPage') {
        if (createdData.length > 0) {
          createdData.map((item) => (item.isActive = true));
        }
      }
      if (key === 'inspection') {
        createdData = createdData.map((item) => {
          handleTeamData(item);
          return item;
        });
        updatedData = updatedData.map((item) => {
          handleTeamData(item);
          return item;
        });
      }

      if (key === 'signatureImage') {
        createdData = [];
        updatedData = [];
        key = 'signature';
      }

      changes[key] = {
        created: _.map(createdData, (item) => transformPushSyncObject(item, key)),
        updated: _.map(updatedData, (item) => transformPushSyncObject(item, key)),
        deleted: deletedData,
      };
    });

    return changes;
  } catch (e) {
    throw e;
  }
};
