/* eslint-disable no-unused-expressions */
import { useStateValue, useHandlerAction } from '../../index';
import { GET_WORKFLOW_STATUS, getWorkflowSettingsFailure, getWorkflowSettingsSuccess } from '../Actions';
import { RequestApi } from '../../../Services';

const useWorkflow = () => {
  const [{ workflow }, dispatch] = useStateValue();
  const { withErrorHandling } = useHandlerAction();

  const getWorkflowSettings = async (moduleId) => {
    try {
      const statusList = await RequestApi.getWorkflowStatus(moduleId);
      const priorities = await RequestApi.getWorkflowPriorities(moduleId);
      const trackers = await RequestApi.getWorkflowTrackers(moduleId);
      const fields = await RequestApi.getWorkflowFields(moduleId);

      dispatch(
        getWorkflowSettingsSuccess({
          statusList,
          priorities,
          trackers,
          fields,
        })
      );
    } catch (err) {
      dispatch(getWorkflowSettingsFailure(err));
    }
  };

  const getWorkflowStatus = async (moduleId) => RequestApi.getWorkflowStatus(moduleId);

  return {
    workflow,
    getWorkflowSettings,
    getWorkflowStatus: withErrorHandling(GET_WORKFLOW_STATUS, getWorkflowStatus),
  };
};

export default useWorkflow;
