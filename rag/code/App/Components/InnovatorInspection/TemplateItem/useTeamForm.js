import _ from 'lodash';
import useUser from '../../../Context/User/Hooks/UseUser';
import useTeam from '../../../Context/Team/Hooks/UseTeam';

export function useTeamForm(form) {
  const {
    user: { user },
  } = useUser();
  const {
    team: { teamLeadIds },
  } = useTeam();
  const idUser = _.get(user, 'id');
  const isMyForm = idUser === form.creatorUserId;
  const isTeamLead = _.findIndex(form.team, (item) => _.includes(teamLeadIds, item.id)) > -1;
  return {
    isMyForm,
    isTeamLead,
  };
}
