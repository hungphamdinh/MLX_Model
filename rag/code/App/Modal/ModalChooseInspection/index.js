/**
 * Created by thienmd on 10/2/20
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '@Elements';
import withModal from '@HOC/ModalHOC';
import I18n from '@I18n';
import { FormProvider } from 'react-hook-form';
import Row from '../../Components/Grid/Row';
import { Colors } from '../../Themes';
import { FormDropdown } from '../../Components/Forms';
import { useCompatibleForm } from '../../Utils/hook';

const ModalChooseInspection = ({ onSubmit, data, buttonTitle }) => {
  const formMethods = useCompatibleForm({
    defaultValues: {
      workflow: '',
    },
  });

  const onComplete = (values) => {
    onSubmit(values.workflow);
  };

  return (
    <FormProvider {...formMethods}>
      <View style={{ backgroundColor: Colors.bgMain }}>
        <FormDropdown
          label="INSPECTION_INSPECTION_JOB"
          name="workflow"
          showValue={false}
          showCheckAll={false}
          showSearchBar
          options={data}
        />
        <Row style={styles.actionContainer}>
          <Button rounded primary title={I18n.t(buttonTitle)} onPress={formMethods.handleSubmit(onComplete)} />
        </Row>
      </View>
    </FormProvider>
  );
};

export default withModal(ModalChooseInspection, 'INSPECTION_VIEW_REPORT_MODAL_TITLE');

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
