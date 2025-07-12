/* @flow */
import React from 'react';

const defaultValue = {
  tenantSelected: {},
  listTenants: [],
  user: {},
  initData: {},
  workOrderTaskStatus: [],
  workOrderQuickCreateInitialSetting: {},
  locationSetting: {},
  languages: [],
  languageID: 'en',
  teams: [],
  groupCategories: {},
  isShowNotice: false,
  errorMessageApp: '',
};

const AppContext = React.createContext(defaultValue);
const { Provider, Consumer } = AppContext;
export default AppContext;
export { Provider as AppProvider, Consumer as AppConsumer, defaultValue as AppDefaultValue };
