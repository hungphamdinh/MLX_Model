/**
 * Created by thienmd on 9/25/20
 */
import { DeviceStore } from '@Services/MMKVStorage';
import SyncDB from '../Services/OfflineDB/SyncDB';

class Network {
  static instance: Network;
  isConnected = false;
  isInspectionOffline = false;

  constructor() {
    if (Network.instance) {
      throw new Error('Error: Instantiation failed: Use SingletonClass.getInstance() instead of new.');
    }
  }

  static getInstance(): Network {
    if (!Network.instance) {
      Network.instance = new Network();
    }
    return this.instance;
  }

  setConnected(isConnected) {
    // console.log('on network changed ', isConnected);
    // disable for development
    this.isConnected = isConnected;
  }

  setIsInspectionOffline(isInspectionOffline) {
    this.isInspectionOffline = isInspectionOffline;
  }

  handleOffline = (onlineFnc, offlineFnc, ...params) => {
    const action = !this.isConnected ? offlineFnc : onlineFnc;
    if (!this.isConnected && !offlineFnc) {
      // null offline fnc
      return undefined;
    }
    return action(...params);
  };

  handleCacheRequest = async (onlineFnc, ...params) => {
    const fncName = onlineFnc.name;
    if (this.isConnected) {
      const result = await onlineFnc(...params);
      await SyncDB.database.adapter.setLocal(fncName, JSON.stringify(result));
      return result;
    }
    // get from caching
    const rawData = await SyncDB.database.adapter.getLocal(fncName);
    if (rawData) {
      return JSON.parse(rawData);
    }
    throw Error('No response');
  };

  handleCacheRequestFromAsyncStorage = async (onlineFnc, ...params) => {
    const fncName = onlineFnc.name;
    if (this.isConnected) {
      const result = await onlineFnc(...params);
      await DeviceStore.save(fncName, JSON.stringify(result));
      return result;
    }
    // get from caching
    const rawData = await DeviceStore.getString(fncName);
    if (rawData) {
      return JSON.parse(rawData);
    }
    throw Error('No response');
  };
}

const instance = Network.getInstance();
export default instance;

export const handleCacheRequest = instance.handleCacheRequest;

export const handleCacheRequestFromAsyncStorage = instance.handleCacheRequestFromAsyncStorage;
