import { synchronize } from '@nozbe/watermelondb/sync';
import SyncDB from './OfflineDB/SyncDB';
import { RequestApi } from './index';
import { transformPullChanges, transformPushChanges } from '../Transforms/SyncTransformer';
import logService from './LogService';
const log = {};

export async function makeSyncRequest(pullOnly = false) {
  const syncOptions = {
    database: SyncDB.database,
    log,
    // sendCreatedAsUpdated: true,
    pullChanges: async ({ lastPulledAt, schemaVersion, migration }) => {
      const params = {
        lastPulledAt: migration ? undefined : lastPulledAt,
        schemaVersion,
        migration,
      };
      const result = await RequestApi.pullChangesV1(params);
      const { timeStamp, ...data } = result;
      const changes = transformPullChanges(data, lastPulledAt);
      return { changes, timestamp: timeStamp };
    },
    migrationsEnabledAtVersion: 2,
  };
  if (!pullOnly) {
    syncOptions.pushChanges = async ({ changes, lastPulledAt }) => {
      const pushChanges = transformPushChanges(changes);
      const body = {
        timeStamp: lastPulledAt,
        changes: pushChanges,
      };
      await RequestApi.pushChanges(body);
    };
  }
  await synchronize(syncOptions);
  logService.info('sync start at', log.startedAt);
  logService.info('sync finish at', log.finishedAt);
  return log;
}
