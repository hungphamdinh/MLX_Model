/**
 * Created by thienmd on 8/11/20
 */

class PermissionConfig {
  static _instance: PermissionConfig;
  permissions = {};

  constructor() {
    if (PermissionConfig._instance) {
      throw new Error('Error: Instantiation failed: Use SingletonClass.getInstance() instead of new.');
    }
  }

  static getInstance(): PermissionConfig {
    if (!PermissionConfig._instance) {
      PermissionConfig._instance = new PermissionConfig();
    }
    return this._instance;
  }
}

const instance = PermissionConfig.getInstance();

export function isGranted(permissionName) {
  if (typeof permissionName === 'string') {
    return instance.permissions[permissionName];
  }
  return true;
}

export function isGrantedAny(...permissionNames) {
  const { permissions } = instance;
  return permissionNames.filter((name) => permissions[name]).length > 0;
}

export function isGrantedForCreateUpdate(isCreate, createPermission, updatePermission) {
  if (isCreate) {
    return instance.permissions[createPermission];
  }
  return instance.permissions[updatePermission];
}

export default instance;
