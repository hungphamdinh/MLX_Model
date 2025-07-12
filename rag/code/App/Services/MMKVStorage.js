import { MMKV } from 'react-native-mmkv';
import AsyncStorage from '@react-native-community/async-storage';
import configs from '../Config';

class Storage {
  constructor(storageId, encryptionKey) {
    this.mmkvStorage = new MMKV({
      id: storageId,
      encryptionKey,
    });
  }

  save = (key, value) => {
    if (Array.isArray(value) || typeof value === 'object') {
      value = JSON.stringify(value);
    }
    this.mmkvStorage.set(key, value);
  };
  delete = (key) => {
    this.mmkvStorage.delete(key);
  };
  setBoolean = (key, value) => {
    return this.mmkvStorage.set(key, value);
  };
  getBoolean = (key) => {
    return this.mmkvStorage.getBoolean(key);
  };
  getString = (key) => {
    return this.mmkvStorage.getString(key);
  };
  get = (key) => {
    const value = this.mmkvStorage.getString(key);
    try {
      if (value) {
        return JSON.parse(value);
      }
      return value;
    } catch (e) {
      return value;
    }
  };
  getNumber = (...params) => this.mmkvStorage.getNumber(...params);
  getBoolean = (...params) => this.mmkvStorage.getBoolean(...params);
  getAllKeys = () => this.mmkvStorage.getAllKeys();

  async migrateFromAsyncStorage() {
    const start = global.performance.now();

    const keys = await AsyncStorage.getAllKeys();

    for (const key of keys) {
      try {
        const value = await AsyncStorage.getItem(key);
        if (value != null) {
          if (['true', 'false'].includes(value)) {
            this.mmkvStorage.set(key, value === 'true');
          } else {
            this.mmkvStorage.set(key, value);
          }
        }
      } catch (error) {
        console.error(`Failed to migrate key "${key}" from AsyncStorage to MMKV!`, error);
        throw error;
      }
    }

    this.mmkvStorage.set('hasMigratedFromAsyncStorage', true);

    const end = global.performance.now();
    console.log(`Migrated from AsyncStorage -> MMKV in ${end - start}ms!`);
    return true;
  }
}

const DeviceStore = new Storage('P3', configs.localPassword);
let ProtectedStorage = null;

const getStorageInfo = async (key, mmkv = ProtectedStorage, type) => {
  let storageData = await AsyncStorage.getItem(key);
  if (storageData) {
    storageData = JSON.parse(storageData);
  } else if (mmkv && !storageData) {
    storageData = await mmkv.get(key);
  }
  return storageData;
};

const initProtectedStorage = (key) => {
  try {
    ProtectedStorage = new Storage('P3_SensitiveInfo', key);
    return true;
  } catch (err) {
    return null;
  }
};
export { ProtectedStorage, DeviceStore, getStorageInfo, initProtectedStorage };
