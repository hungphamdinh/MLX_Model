import FormMgr from './FormMgr';
import FormPageMgr from './FormPageMgr';
import FormPageGroupMgr from './FormPageGroupMgr';
import FormQuestionMgr from './FormQuestionMgr';
import FormQuestionAnswerMgr from './FormQuestionAnswerMgr';
import FormUserAnswerMgr from './FormUserAnswerMgr';
import FormUserAnswerQuestionImageMgr from './FormUserAnswerQuestionImageMgr';
import FormUserAnswerQuestionOptionMgr from './FormUserAnswerQuestionOptionMgr';
import FormUserAnswerQuestionMarchingMgr from './FormUserAnswerQuestionMarchingMgr';
import FormUserAnswerQuestionMgr from './FormUserAnswerQuestionMgr';
import FormUserAnswerQuestionFormStatusMgrMarchingMgr from './FormStatusMgr';
import InspectionMgr from './InspectionMgr';
import PropertyMgr from './PropertyMgr';
import SignatureImageMgr from './SignatureImageMgr';
import WorkflowMgr from './WorkflowMgr';
import { TableNames } from '../IDGenerator';
import FormSubQuestionAnswerMgr from './FormSubQuestionAnswerMgr';
import FormSubQuestionMgr from './FormSubQuestionMgr';
import FormSubUserAnswerQuestionMgr from './FormSubUserAnswerQuestionMgr';
import FormSubUserAnswerQuestionOptionMgr from './FormSubUserAnswerQuestionOptionMgr';

export const getMgrByTableName = (tableName) => {
  switch (tableName) {
    case TableNames.form:
      return FormMgr;
    case TableNames.formPage:
      return FormPageMgr;
    case TableNames.formQuestion:
      return FormQuestionMgr;
    case TableNames.formQuestionAnswer:
      return FormQuestionAnswerMgr;
    case TableNames.formUserAnswer:
      return FormUserAnswerMgr;
    case TableNames.formUserAnswerQuestionImage:
      return FormUserAnswerQuestionImageMgr;
    case TableNames.formUserAnswerQuestionOption:
      return FormUserAnswerQuestionOptionMgr;
    case TableNames.formUserAnswerQuestionMarching:
      return FormUserAnswerQuestionMarchingMgr;
    case TableNames.formStatus:
      return FormUserAnswerQuestionFormStatusMgrMarchingMgr;
    case TableNames.inspection:
      return InspectionMgr;
    case TableNames.inspectionProperty:
      return PropertyMgr;
    case TableNames.signatureImage:
      return SignatureImageMgr;
    case TableNames.workflow:
      return WorkflowMgr;
    case TableNames.formUserAnswerQuestion:
      return FormUserAnswerQuestionMgr;
    case TableNames.formPageGroup:
      return FormPageGroupMgr;
    case TableNames.formSubQuestion:
      return FormSubQuestionMgr;
    case TableNames.formSubQuestionAnswer:
      return FormSubQuestionAnswerMgr;
    case TableNames.formSubUserAnswerQuestion:
      return FormSubUserAnswerQuestionMgr;
    case TableNames.formSubUserAnswerQuestionOption:
      return FormSubUserAnswerQuestionOptionMgr;
    default:
      throw new Error(`No Mgr found for table name: ${tableName}`);
  }
};
