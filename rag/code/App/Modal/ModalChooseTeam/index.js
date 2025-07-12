/**
 * Created by thienmd on 10/2/20
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '@Elements';
import withModal from '@HOC/ModalHOC';
import { FormProvider, useForm } from 'react-hook-form';
import _ from 'lodash';
import Row from '../../Components/Grid/Row';
import { Colors } from '../../Themes';
import { FormDropdown } from '../../Components/Forms';
import useTeam from '../../Context/Team/Hooks/UseTeam';
import { useTeamForm } from '../../Components/InnovatorInspection/TemplateItem/useTeamForm';

const ModalChooseTeam = ({ onSubmit, publishTeamData }) => {
  const {
    team: { teams, teamLeadIds },
  } = useTeam();
  const { isPublish, form } = publishTeamData;
  const { isMyForm } = useTeamForm(form);
  const formMethods = useForm({
    defaultValues: {
      teamIds: [],
    },
  });

  const teamIds = formMethods.watch('teamIds');

  const selectedTeams = form.team;
  const selectedTeamIds = _.map(selectedTeams, (item) => item.id);
  let teamData = teams.filter((item) => !_.includes(selectedTeamIds, item.id));
  if (!isPublish) {
    teamData = selectedTeams;
    if (!isMyForm) {
      teamData = _.filter(selectedTeams, (item) => _.includes(teamLeadIds, item.id));
    }
  }

  teamData = _.map(teamData, (team) => {
    const fullTeam = _.find(teams, { id: team.id });
    return {
      ...team,
      name: fullTeam ? fullTeam.name : '',
    };
  });

  const handleSubmit = (values) => {
    onSubmit(values.teamIds);
  };

  return (
    <FormProvider {...formMethods}>
      <View style={{ backgroundColor: Colors.bgMain }}>
        <FormDropdown label="INSPECTION_TEAM" name="teamIds" showSearchBar options={teamData} multiple />
        <Row style={styles.actionContainer}>
          <Button
            disabled={teamIds.length === 0}
            rounded
            primary
            title="COMMON_SAVE"
            onPress={formMethods.handleSubmit(handleSubmit)}
          />
        </Row>
      </View>
    </FormProvider>
  );
};

export default withModal(ModalChooseTeam, 'INSPECTION_CHOOSE_TEAM');

const styles = StyleSheet.create({
  header: {
    marginVertical: 30,
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  actionContainer: {
    justifyContent: 'space-around',
  },
});
