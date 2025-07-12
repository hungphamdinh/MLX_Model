import withBaseMgr from './BaseMgr';
import { Modules } from '../../../Config/Constants';
import { Q } from '@nozbe/watermelondb';
import { generateInspectionUUID, TableNames } from '../IDGenerator';

const FormUserAnswerMgr = (collection, baseMgr) => ({
  createInspectionUserAnswer: async (inspectionId, userId) =>
    baseMgr.create((obj) => {
      obj.id = generateInspectionUUID(TableNames.formUserAnswer);
      obj.parentGuid = inspectionId;
      obj.moduleId = `${Modules.INSPECTION}`;
      obj.userAnswerId = userId;
    }),
  getFormAnswerByInspectionId: async (inspectionId) => baseMgr.queryOne(Q.where('parentGuid', Q.eq(inspectionId))),
});

export default withBaseMgr('formUserAnswer')(FormUserAnswerMgr);
