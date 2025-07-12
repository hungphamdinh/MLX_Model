// index.js
import RNFS from 'react-native-fs';
import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { databaseSchema } from './Schema';
import Form from './Models/Form';
import FormPage from './Models/FormPage';
import FormQuestion from './Models/FormQuestion';
import FormQuestionType from './Models/FormQuestionType';
import FormStatus from './Models/FormStatus';
import FormGroup from './Models/FormGroup';
import InspectionProperty from './Models/InspectionProperty';
import FormCategory from './Models/FormCategory';
import Inspection from './Models/Inspection';
import Workflow from './Models/Workflow';
import FormUserAnswer from './Models/FormUserAnswer';
import FormUserAnswerQuestion from './Models/FormUserAnswerQuestion';
import FormQuestionAnswer from './Models/FormQuestionAnswer';
import Status from './Models/Status';
import Priority from './Models/Priority';
import FormUserAnswerQuestionImage from './Models/FormUserAnswerQuestionImage';
import FormUserAnswerQuestionOption from './Models/FormUserAnswerQuestionOption';
import FormUserAnswerQuestionMarching from './Models/FormUserAnswerQuestionMarching';
import SignatureImage from './Models/SignatureImage';
import FormQuestionAnswerTemplate from './Models/FormQuestionAnswerTemplate';
import FormPageGroup from './Models/FormPageGroup';
import FormSubQuestion from './Models/FormSubQuestion';
import FormSubQuestionAnswer from './Models/FormSubQuestionAnswer';

import migrations from './migrations';
import FormSubUserAnswerQuestion from './Models/FormSubUserAnswerQuestion';
import FormSubUserAnswerQuestionOption from './Models/FormSubUserAnswerQuestionOption';

console.log('document path', RNFS.DocumentDirectoryPath);

class SyncDB {
  static instance: SyncDB;
  database = undefined;
  // for auto save
  isAutoSaveProcessing = false;
  queueAutoSave = null;
  orginalInspectionForm = null;
  lockSync = false;
  databaseName = undefined;
  constructor() {
    if (SyncDB.instance) {
      throw new Error('Error: Instantiation failed: Use SingletonClass.getInstance() instead of new.');
    }
  }

  static getInstance(): SyncDB {
    if (!SyncDB.instance) {
      SyncDB.instance = new SyncDB();
    }
    return this.instance;
  }

  setDataBaseName(userId, tenantId) {
    const databaseName = `DATA_${userId}_${tenantId}`;
    this.databaseName = databaseName;

    const adapter = new SQLiteAdapter({
      schema: databaseSchema,
      dbName: databaseName, // optional database name or file system path
      migrations, // optional migrations
      jsi: !__DEV__ && true,
      // synchronous: true, // synchronous mode only works on iOS. improves performance and reduces glitches in most cases, but also has some downsides - test with and without it
      // experimentalUseJSI: true, // experimental JSI mode, use only if you're brave
    });

    this.database = new Database({
      adapter,
      modelClasses: [
        Form,
        FormPage,
        FormQuestion,
        FormQuestionType,
        FormStatus,
        InspectionProperty,
        FormGroup,
        FormCategory,
        Inspection,
        Workflow,
        FormUserAnswer,
        FormUserAnswerQuestion,
        FormQuestionAnswer,
        Status,
        Priority,
        FormUserAnswerQuestionImage,
        FormUserAnswerQuestionOption,
        SignatureImage,
        FormQuestionAnswerTemplate,
        FormUserAnswerQuestionMarching,
        FormPageGroup,
        FormSubQuestion,
        FormSubQuestionAnswer,
        FormSubUserAnswerQuestion,
        FormSubUserAnswerQuestionOption,
      ],
    });
  }

  async action(...params) {
    return this.database.write(...params);
  }
}

const syncDBInstance = SyncDB.getInstance();

export default syncDBInstance;
