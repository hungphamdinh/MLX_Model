import { Modules } from '@Config/Constants';

import useInspection from '@Context/Inspection/Hooks/UseInspection';
import useTeam from '@Context/Team/Hooks/UseTeam';
import useWorkflow from '@Context/Workflow/Hooks/UseWorkflow';

const useInspectionInitialization = () => {
    const {
        getInspectionHeaders,
        getInspectionFooters,
    } = useInspection();

    const { getWorkflowSettings } = useWorkflow();

    const { getTeamsInspection } = useTeam();

    const initInspectionInfo = () => {
      getTeamsInspection();
      getInspectionHeaders();
      getInspectionFooters();
      getWorkflowSettings(Modules.INSPECTION);
    };

    return { initInspectionInfo };
};

export default useInspectionInitialization;