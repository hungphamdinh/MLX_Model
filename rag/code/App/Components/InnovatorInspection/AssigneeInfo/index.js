import React from 'react';
import useTeam from '@Context/Team/Hooks/UseTeam';
import useUser from '@Context/User/Hooks/UseUser';
import { FormCheckBox, FormDropdown } from '../../../Components/Forms';

const AssigneeInfo = ({ formMethods: { setFieldValue, watch } }) => {
  const {
    user: { user },
  } = useUser();

  const {
    getUserInTeam,
    team: { inspectionTeams, assignedInspectionTeams, usersInTeam },
  } = useTeam();

  const lockAssigned = [user.id];
  const [isAllowTeamAssignment] = watch(['isAllowTeamAssignment']);

  const onSelectTeam = (teamId) => {
    setFieldValue('listAssigned', undefined);
    setFieldValue('teamId', undefined);
    setFieldValue('listAssigneeIds', [user.id]);
    getUserInTeam(teamId);
  };

  return (
    <>
      <FormCheckBox label="INSPECTION_ALLOW_TEAM_ASSIGNMENT" name="isAllowTeamAssignment" />

      {isAllowTeamAssignment ? (
        <FormDropdown
          showCheckAll={false}
          showSearchBar
          options={assignedInspectionTeams}
          label="INSPECTION_TEAMS"
          placeholder=""
          required
          mode="small"
          onChange={() => setFieldValue('listAssigneeIds', [])}
          name="teamId"
        />
      ) : (
        <>
          <FormDropdown
            showCheckAll={false}
            showSearchBar
            options={inspectionTeams}
            label="INSPECTION_ASSIGNEE_TEAM"
            placeholder=""
            mode="small"
            required
            name="teamAssigneeId"
            onChange={onSelectTeam}
          />

          <FormDropdown
            showCheckAll={false}
            showSearchBar
            options={usersInTeam}
            label="INSPECTION_ASSIGNEES"
            name="listAssigneeIds"
            mode="small"
            fieldName="displayName"
            valKey="userId"
            multiple
            required
            lockValues={lockAssigned}
          />
        </>
      )}
    </>
  );
};

export default AssigneeInfo;
