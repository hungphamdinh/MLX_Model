import { useStateValue, useHandlerAction } from '../../index';
import { RequestApi } from '../../../Services';
import { GET_TENANT_LIST } from '../Actions';

const useTenant = () => {
  const [{ tenant }] = useStateValue();
  const { withErrorHandling } = useHandlerAction();

  const getTenantList = async (params) => {
    const response = await RequestApi.getTenantList({
      ...params,
      editionIdSpecified: false,
    });
    return response;
  };

  return {
    tenant,
    getTenantList: withErrorHandling(GET_TENANT_LIST, getTenantList),
  };
};

export default useTenant;
