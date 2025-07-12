import { Q } from '@nozbe/watermelondb';
import withBaseMgr from './BaseMgr';

const StatusMgr = (collection, baseMgr) => ({
  getDefaultStatus: async () => baseMgr.queryOne(Q.where('isDefault', Q.eq(true))),
  getClosedStatus: async () => baseMgr.queryOne(Q.where('isIssueClosed', Q.eq(true)), Q.sortBy('position', Q.asc)),
  getInProgressStatus: async () => baseMgr.queryOne(Q.where('position', Q.eq(2))),
  getListStatus: async () => {
    const status = await collection.query().fetch();
    return {
      items: status.map((item) => item.getValue()),
    };
  },
});

export default withBaseMgr('status')(StatusMgr);
