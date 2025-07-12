/**
 * Created by thienmd on 8/11/20
 */
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';

export const TableNames = {
  formPage: 'formPage',
  form: 'form',
  formQuestion: 'formQuestion',
  inspectionProperty: 'inspectionProperty',
  formQuestionAnswer: 'formQuestionAnswer',
  formUserAnswerQuestion: 'formUserAnswerQuestion',
  formUserAnswer: 'formUserAnswer',
  workflow: 'workflow',
  inspection: 'inspection',
  formUserAnswerQuestionImage: 'formUserAnswerQuestionImage',
  formUserAnswerQuestionOption: 'formUserAnswerQuestionOption',
  signatureImage: 'signatureImage',
  formUserAnswerQuestionMarching: 'formUserAnswerQuestionMarching',
  formPageGroup: 'formPageGroup',
  formSubQuestion: 'formSubQuestion',
  formSubQuestionAnswer: 'formSubQuestionAnswer',
  formSubUserAnswerQuestionOption: 'formSubUserAnswerQuestionOption',
  formSubUserAnswerQuestion: 'formSubUserAnswerQuestion',
};

class IDGenerator {
  static _instance: IDGenerator;
  localIds = {};

  constructor() {
    if (IDGenerator._instance) {
      throw new Error('Error: Instantiation failed: Use IDGenerator.getInstance() instead of new.');
    }
  }

  static getInstance(): IDGenerator {
    if (!IDGenerator._instance) {
      IDGenerator._instance = new IDGenerator();
    }
    return this._instance;
  }

  generate(tableName) {
    const tableIds = _.get(this.localIds, tableName) || [];
    const newUUID = uuidv4();
    if (_.includes(tableIds, newUUID)) {
      return this.generate(tableName);
    }
    tableIds.push(newUUID);
    this.localIds[tableName] = tableIds;
    return newUUID;
  }
}

const instance = IDGenerator.getInstance();

export const generateInspectionUUID = (tableName) => instance.generate(tableName);

export default instance;
