import { Q } from '@nozbe/watermelondb';
import withBaseMgr from './BaseMgr';
import { FormStatusCode } from '../../../Config/Constants';

const FormStatusMgr = (collection, baseMgr) => ({
  getPublicStatus: async () => baseMgr.queryOne(Q.where('code', Q.eq(FormStatusCode.PUBLIC))),
});

export default withBaseMgr('formStatus')(FormStatusMgr);

