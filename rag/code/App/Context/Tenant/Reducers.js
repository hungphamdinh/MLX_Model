import _ from 'lodash';
import ListModel from '../Model/ListModel';
import { GET_TENANT_LIST } from './Actions';

export const INITIAL_STATE = {
  tenantList: new ListModel(),
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_TENANT_LIST.REQUEST: {
      const { tenantList } = state;
      tenantList.setPage(1);
      tenantList.totalPage = 1;
      return {
        ...state,
        tenantList: _.cloneDeep(tenantList),
      };
    }
    case GET_TENANT_LIST.SUCCESS: {
      const { tenantList } = state;
      tenantList.setData(action.payload);
      tenantList.totalPage = 1;
      return {
        ...state,
        tenantList: _.cloneDeep(tenantList),
      };
    }
    default:
      return state;
  }
};
