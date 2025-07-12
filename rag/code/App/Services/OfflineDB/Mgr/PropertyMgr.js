import { Q } from '@nozbe/watermelondb';
import { PAGE_SIZE } from '../../../Config';
import withBaseMgr from './BaseMgr';

const PropertyMgr = (collection, baseMgr) => ({
  getPropertyList: async (page, keyword) => {
    const query = collection.query(
      Q.where('name', Q.like(`%${Q.sanitizeLikeString(keyword)}%`)),
      Q.where('isActive', Q.eq(true)),
      Q.skip((page - 1) * PAGE_SIZE),
      Q.take(PAGE_SIZE)
    );
    const queryCount = collection.query(Q.where('name', Q.like(`%${Q.sanitizeLikeString(keyword)}%`)));
    const items = await query.fetch();
    const totalCount = await queryCount.fetchCount();
    return {
      items: items.map((item) => item.getValue()),
      totalCount,
    };
  },
  getPropertyDetail: async (id) => collection.find(id),
});

export default withBaseMgr('inspectionProperty')(PropertyMgr);
