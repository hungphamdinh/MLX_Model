import { Q } from '@nozbe/watermelondb';
import withBaseMgr from './BaseMgr';
import FormPageMgr from './FormPageMgr';

const mgr = (collection, baseMgr) => ({
  getFormPageGroupByFormId: async (formGuid) => {
    const formPageGroups = await collection.query(Q.where('formGuid', formGuid)).fetch();

    const formPageGroupsValue = formPageGroups.map((item) => item.getValue());
    formPageGroupsValue.forEach(async (pageGroup) => {
      const formPages = await FormPageMgr.getFormPageByGroupId(pageGroup.id);
      pageGroup.formPages = formPages;
    });

    return formPageGroupsValue;
  },
  getFormPageGroupById: async (id) => {
    const result = await baseMgr.queryOne(Q.where('id', id));
    return result;
  },
});

const FormPageGroupMgr = withBaseMgr('formPageGroup')(mgr);

export default FormPageGroupMgr;
