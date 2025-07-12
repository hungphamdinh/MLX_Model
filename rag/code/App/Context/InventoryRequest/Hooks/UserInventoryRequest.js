import { useHandlerAction, useStateValue } from '../../index';
import { RequestApi } from '../../../Services';
import { GET_ALL_IR, GET_IR_SETTING } from '../Actions';

const useInventoryRequest = () => {
  const [{ inventoryRequest }] = useStateValue();
  const { withLoadingAndErrorHandling } = useHandlerAction();

  const getAllIR = async (params) => RequestApi.getInventoryRequests(params);

  const getIRSetting = async () => RequestApi.getIRSetting();

  return {
    inventoryRequest,
    getAllIR: withLoadingAndErrorHandling(GET_ALL_IR, getAllIR),
    getIRSetting: withLoadingAndErrorHandling(GET_IR_SETTING, getIRSetting),
  };
};

export default useInventoryRequest;
