// model/schema.js
import { appSchema } from '@nozbe/watermelondb';

import FormTable from './Tables/FormTable';
import FormCategoryTable from './Tables/FormCategoryTable';
import FormGroupTable from './Tables/FormGroupTable';
import FormPageTable from './Tables/FormPageTable';
import FormQuestionTable from './Tables/FormQuestionTable';
import FormQuestionTypeTable from './Tables/FormQuestionTypeTable';
import InspectionPropertyTable from './Tables/InspectionPropertyTable';
import FormStatusTable from './Tables/FormStatusTable';
import FormQuestionAnswerTable from './Tables/FormQuestionAnswerTable';
import FormUserAnswerTable from './Tables/FormUserAnswerTable';
import FormUserAnswerQuestionTable from './Tables/FormUserAnswerQuestionTable';
import WorkflowTable from './Tables/WorkflowTable';
import InspectionTable from './Tables/InspectionTable';
import StatusTable from './Tables/StatusTable';
import PriorityTable from './Tables/PriorityTable';
import FormUserAnswerQuestionImageTable from './Tables/FormUserAnswerQuestionImageTable';
import FormUserAnswerQuestionOptionTable from './Tables/FormUserAnswerQuestionOptionTable';
import SignatureImageTable from './Tables/SignatureImageTable';
import FormQuestionAnswerTemplateTable from './Tables/FormQuestionAnswerTemplateTable';
import FormUserAnswerQuestionMarching from './Tables/FormUserAnswerQuestionMarching';
import FormPageGroupTable from './Tables/FormPageGroupTable';
import FormSubQuestionTable from './Tables/FormSubQuestionTable';
import FormSubQuestionAnswerTable from './Tables/FormSubQuestionAnswerTable';
import FormSubUserAnswerQuestionTable from './Tables/FormSubUserAnswerQuestionTable';
import FormSubUserAnswerQuestionOptionTable from './Tables/FormSubUserAnswerQuestionOptionTable';

export const databaseSchema = appSchema({
  //
  version: 14,
  tables: [
    FormPageTable,
    FormTable,
    FormCategoryTable,
    FormGroupTable,
    FormQuestionTable,
    FormQuestionTypeTable,
    InspectionPropertyTable,
    FormStatusTable,
    FormQuestionAnswerTable,
    FormUserAnswerQuestionTable,
    FormUserAnswerTable,
    WorkflowTable,
    InspectionTable,
    StatusTable,
    PriorityTable,
    FormUserAnswerQuestionImageTable,
    FormUserAnswerQuestionOptionTable,
    SignatureImageTable,
    FormQuestionAnswerTemplateTable,
    FormUserAnswerQuestionMarching,
    FormPageGroupTable,
    FormSubQuestionTable,
    FormSubQuestionAnswerTable,
    FormSubUserAnswerQuestionTable,
    FormSubUserAnswerQuestionOptionTable,
  ],
});
