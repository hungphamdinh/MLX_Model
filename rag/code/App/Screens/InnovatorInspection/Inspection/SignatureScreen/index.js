/* eslint-disable no-unused-expressions */
import React, { useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import _ from 'lodash';
import { FormProvider } from 'react-hook-form';
import BaseLayout from '@Components/Layout/BaseLayout';
import SignatureView from '@Components/InnovatorInspection/SignatureView';
import I18n from '@I18n';
import * as Yup from 'yup';
import styles from './styles';
import useInspection from '../../../../Context/Inspection/Hooks/UseInspection';
import { ImageResource, Fonts } from '../../../../Themes';
import { Text } from '../../../../Elements';
import { useCompatibleForm, useYupValidationResolver } from '../../../../Utils/hook';
import { FormInput } from '../../../../Components/Forms';

const SignatureScreen = ({ navigation }) => {
  const saveSignatures = React.useRef([]);
  const [scrollEnabled, setScrollEnabled] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [countPathChange, setCountPathChange] = React.useState(0);
  const isAddNew = _.get(navigation, 'state.routeName') === 'addSignature';

  const totalScore = navigation.getParam('totalScore');
  const workflowParentId = navigation.getParam('workflowParentId');
  const workflowId = navigation.getParam('workflowId');
  const signature = navigation.getParam('signature');
  const showModal = navigation.getParam('showModal');
  const index = navigation.getParam('index');

  const validationSchema = Yup.object().shape({
    title: Yup.string().required(I18n.t('COMMON_FIELD_IS_REQUIRED')),
  });

  const { saveInspectionSignatures, resetInspectionSignatureImage } = useInspection();

  useEffect(
    () => () => {
      resetInspectionSignatureImage();
      if (showModal) {
        showModal();
      }
    },
    []
  );

  const onSubmitSignatures = () => {
    setIsSubmitting(true);
    saveSignatures?.current[0]();
  };

  const onSignatureSaved = async (signatureValue) => {
    const { title, description, guid, fileUrl } = formMethods.watch();
    const localSignature = {
      ...signatureValue,
      title,
      description,
      guid,
      fileUrl,
      moduleName: `InspectionSignature${index > 1 ? index : ''}`,
    };
    submitRequest(localSignature);
  };

  const submitRequest = async (localSignature) => {
    await saveInspectionSignatures({
      signatures: [localSignature],
      workflowParentId,
      workflowId,
      index,
    });

    setIsSubmitting(false);
  };

  const onStrokeStart = () => {
    setScrollEnabled(false);
  };

  const onStrokeEnd = () => {
    setScrollEnabled(true);
  };

  const onPathChange = () => {
    setCountPathChange(countPathChange + 1);
  };

  const formMethods = useCompatibleForm({
    resolver: useYupValidationResolver(validationSchema),
    defaultValues: {
      title: signature.title,
      description: signature.description,
      fileUrl: signature.fileUrl,
      localPath: signature.path !== 'done' ? signature.path : '',
      guid: signature.guid,
    },
  });

  const mainLayoutProps = {
    style: styles.container,
    loading: isSubmitting,
    padding: true,
    title: I18n.t(isAddNew ? 'INSPECTION_SIGN_NOW' : 'INSPECTION_DETAIL_SIGNATURE'),
    rightBtn: isAddNew
      ? {
          icon: ImageResource.IC_SAVE,
          onPress: () => {
            formMethods.handleSubmit(onSubmitSignatures)();
            // onSubmitSignatures();
          },
        }
      : null,
  };

  return (
    <BaseLayout {...mainLayoutProps}>
      <FormProvider {...formMethods}>
        <ScrollView scrollEnabled={scrollEnabled} showsVerticalScrollIndicator={false}>
          {totalScore ? (
            <Text style={styles.textScore}>
              <Text fontFamily={Fonts.Bold} text={`${I18n.t('FORM_TOTAL_SCORE')}: `} />
              <Text text={totalScore} />
            </Text>
          ) : null}
          <FormInput editable={isAddNew} required name="title" placeholder="COMMON_NAME" label="COMMON_NAME" />
          <View style={styles.signature}>
            <SignatureView
              isUploadDirect={!workflowParentId}
              isAddNew={isAddNew}
              onSignatureSaved={onSignatureSaved}
              setFieldValue={formMethods.setFieldValue}
              setSaveFnc={(fnc) => (saveSignatures.current[0] = fnc)}
              name={signature.title}
              onStrokeStart={onStrokeStart}
              onStrokeEnd={onStrokeEnd}
              onPathChange={onPathChange}
              value={formMethods.values}
            />
          </View>
          <FormInput
            editable={isAddNew}
            multiline
            name="description"
            placeholder="COMMON_REMARKS"
            label="COMMON_REMARKS"
          />
        </ScrollView>
      </FormProvider>
    </BaseLayout>
  );
};

export default SignatureScreen;
