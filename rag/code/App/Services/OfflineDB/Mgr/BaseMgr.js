import _ from 'lodash';
import SyncDB from '../SyncDB';
import { generateInspectionUUID } from '../IDGenerator';

export const mergeEntityWith = (entity, newObject) => {
  // merge object except id, guid, remoteId
  const keys = _.keys(newObject).filter(
    (key) => !_.includes(['id', 'guid', 'remoteId', 'created_at', 'updated_at'], key)
  );
  keys.forEach((key) => {
    entity[key] = newObject[key];
  });
};

export const getChildrenValues = async (lazyModels) => {
  const results = await lazyModels;
  return results.map((entity) => entity.getValue());
};

export const getEntityValue = async (lazyModel) => {
  const result = await lazyModel;
  if (result) {
    return result.getValue();
  }
  return null;
};

export const fetchRelationAllowNull = async (lazyModel) => {
  try {
    return await lazyModel;
  } catch (e) {
    console.log('error ', e);
  }
  return null;
};

const withBaseMgr = (table) => (fnc) => {
  const getCollection = () => {
    if (SyncDB.database) {
      return SyncDB.database.get(table);
    }

    return undefined;
  };

  const batchCreate = async (list) =>
    Promise.all(
      list.map(async (item) =>
        getCollection().create((obj) => {
          // if uid is exist will use uid instead for regenerate
          obj.useGuid(item.id || generateInspectionUUID(table));
          mergeEntityWith(obj, item);
        })
      )
    );

  const batchUpdate = async (list) =>
    Promise.all(
      list.map(async ({ id, ...item }) => {
        const entity = await getCollection().find(id);
        return entity.update((obj) => {
          mergeEntityWith(obj, item);
        });
      })
    );

  const batchRemove = async (ids) =>
    Promise.all(
      ids.map(async (id) => {
        const entity = await getCollection().find(id);
        return entity.markAsDeleted();
      })
    );

  const create = async (recordBuilder) =>
    getCollection().create((obj) => {
      recordBuilder(obj);
      obj.useGuid(obj.uid);
    });

  const update = async (id, recordBuilder) => {
    const entity = await getCollection().find(id);
    return entity.update((obj) => {
      recordBuilder(obj);
    });
  };

  const remove = async (id) => {
    const entity = await getCollection().find(id);
    return entity.markAsDeleted();
  };

  // get entity by id
  const find = async (id) => getCollection().find(id);

  // get entity by query
  const queryOne = async (...queries) => {
    const entities = await getCollection()
      .query(...queries)
      .fetch();

    if (_.size(entities) > 0) {
      return _.first(entities);
    }

    return null;
  };

  const query = (...queries) => getCollection().query(...queries);

  const baseMgr = {
    find,
    queryOne,
    create,
    update,
    remove,
    batchCreate,
    batchUpdate,
    batchRemove,
  };

  const collection = {
    query,
    find,
  };

  return {
    ...fnc(collection, baseMgr),
    ...baseMgr,
    collection,
  };
};

export default withBaseMgr;
