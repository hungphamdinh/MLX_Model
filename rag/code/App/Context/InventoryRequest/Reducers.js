import _ from 'lodash';
import ListModel from '../Model/ListModel';
import { GET_ALL_IR, GET_IR_SETTING } from './Actions';

export const INITIAL_STATE = {
  irList: new ListModel(),
  irSetting: undefined,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_ALL_IR.REQUEST: {
      const { irList } = state;
      irList.setPage(action.payload?.page);
      return {
        ...state,
        irList: _.cloneDeep(irList),
      };
    }

    case GET_ALL_IR.SUCCESS: {
      const { irList } = state;
      irList.setData(action.payload);
      return {
        ...state,
        irList: _.cloneDeep(irList),
      };
    }

    case GET_IR_SETTING.SUCCESS:
      return {
        ...state,
        irSetting: action.payload,
      };

    default:
      return state;
  }
};
