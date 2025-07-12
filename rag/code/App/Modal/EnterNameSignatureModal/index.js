/**
 * Created by thienmd on 10/2/20
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '@Elements';
import _ from 'lodash';
import withModal from '@HOC/ModalHOC';
import * as Yup from 'yup';
import I18n from '@I18n';
import { FormProvider } from 'react-hook-form';
import FormInput from '../../Components/Forms/FormInput';
import Row from '../../Components/Grid/Row';
import { AlertNative } from '../../Components';
import { Colors } from '../../Themes';
import { useCompatibleForm, useYupValidationResolver } from '../../Utils/hook';
import { generateInspectionUUID, TableNames } from '../../Services/OfflineDB/IDGenerator';

const EnterNameSignatureModal = ({ onSkip, onSignNow }) => {
  const onAskSkip = () => {
    AlertNative(
      I18n.t('INSPECTION_SKIP_SIGNATURE'),
      I18n.t('INSPECTION_SKIP_SIGNATURE_MESSAGE'),
      onSkip,
      I18n.t('AD_COMMON_YES'),
      I18n.t('AD_COMMON_CANCEL')
    );
  };

  const YupRequiredString = Yup.string().required(I18n.t('FORM_THIS_FIELD_IS_REQUIRED'));
  const validationSchema = Yup.object().shape({
    signatory1: YupRequiredString,
  });

  const onSubmit = (values) => {
    const keys = _.keys(values);
    const signatures = keys.reduce(
      (accumulator, curr) =>
        _.size(values[curr]) > 0
          ? [...accumulator, { id: generateInspectionUUID(TableNames.signatureImage), name: values[curr] }]
          : accumulator,
      []
    );
    onSignNow(signatures);
  };

  const formMethods = useCompatibleForm({
    resolver: useYupValidationResolver(validationSchema),
    defaultValues: {
      signatory1: '',
      signatory2: '',
      signatory3: '',
    },
  });

  return (
    <FormProvider {...formMethods}>
      <View style={{ backgroundColor: Colors.bgMain }}>
        <FormInput label={`${I18n.t('INSPECTION_SIGNATORY')} 1`} placeholder="" name="signatory1" />
        <FormInput label={`${I18n.t('INSPECTION_SIGNATORY')} 2`} placeholder="" name="signatory2" />
        <FormInput label={`${I18n.t('INSPECTION_SIGNATORY')} 3`} placeholder="" name="signatory3" />
        <Row style={styles.actionContainer}>
          <Button rounded light title={I18n.t('INSPECTION_SKIP_SIGNATURE')} onPress={onAskSkip} />
          <Button rounded primary title={I18n.t('INSPECTION_SIGN_NOW')} onPress={formMethods.handleSubmit(onSubmit)} />
        </Row>
      </View>
    </FormProvider>
  );
};

export default withModal(EnterNameSignatureModal, 'INSPECTION_ENTER_THE_NAME_OF_SIGNATORIES');

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
