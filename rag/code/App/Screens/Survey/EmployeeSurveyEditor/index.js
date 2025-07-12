import React, { useState } from 'react';
import I18n from '@I18n';
import _ from 'lodash';

import { View, DeviceEventEmitter } from 'react-native';
import * as Yup from 'yup';
import useForm from '../../../Context/Form/Hooks/UseForm';
import { FormEditorTypes, formItemTypes, Modules } from '../../../Config/Constants';
import FormEditorScreen from '../../InnovatorInspection/Template/FormEditorScreen';
import { transformAnswerData } from '../../../Transforms/FormTransformer';
import EnterNameSignatureModal from '../../../Modal/EnterNameSignatureModal';
import useSurvey from '../../../Context/Survey/Hooks/UseSurvey';
import LocaleConfig from '../../../Config/LocaleConfig';
import { calculateTotalScore } from '../../../Transforms/SurveyTransformer';

const EmployeeSurveyDetail = ({ navigation }) => {
  const isEditor = _.get(navigation, 'state.routeName') === 'employeeSurveyEditor';

  const requiredQuestion = I18n.t('AD_FORM_REQUIRED_QUESTION');
  function questionTypeIncludes(questionTypes, questionType) {
    return _.includes(questionTypes, questionType.id);
  }

  const validationSchema = Yup.object().shape({
    formPages: Yup.array().of(
      Yup.object().shape({
        formQuestions: Yup.array().of(
          Yup.object().shape({
            isMandatory: Yup.boolean(),
            uaqOptions: Yup.array().when(['isMandatory', 'questionType'], {
              is: (isMandatory, questionType) =>
                isMandatory && questionTypeIncludes([formItemTypes.MULTIPLE_CHOICE, formItemTypes.IMAGE], questionType),
              then: Yup.array().required(requiredQuestion),
            }),
            uaqDropdownValue: Yup.object().when(['isMandatory', 'questionType'], {
              is: (isMandatory, questionType) =>
                isMandatory && questionTypeIncludes([formItemTypes.DROPDOWN, formItemTypes.Option], questionType),
              then: Yup.object().required(requiredQuestion),
            }),
            uaqAnswerContent: Yup.string().when(['isMandatory', 'questionType'], {
              is: (isMandatory, questionType) =>
                isMandatory && questionTypeIncludes([formItemTypes.TEXT_BOX, formItemTypes.TEXT_AREA], questionType),
              then: Yup.string().required(requiredQuestion),
            }),
            uaqAnswerDate: Yup.string()
              .nullable()
              .when(['isMandatory', 'questionType'], {
                is: (isMandatory, questionType) => isMandatory && questionTypeIncludes([formItemTypes.DATE_TIME], questionType),
                then: Yup.string().required(requiredQuestion),
              }),
            uaqAnswerNumeric: Yup.string()
              .nullable()
              .when(['isMandatory', 'questionType'], {
                is: (isMandatory, questionType) =>
                  isMandatory && questionTypeIncludes([formItemTypes.NUMBER, formItemTypes.RATING], questionType),
                then: Yup.string().required(requiredQuestion),
              }),
          })
        ),
      })
    ),
  });

  const formRef = React.useRef();

  const { addUserAnswer } = useForm();

  const { uploadSurveySignature, isLoading } = useSurvey();

  const survey = navigation.getParam('survey');

  const [signatureVisible, setSignatureVisible] = React.useState(false);
  const [formVal, setFormVal] = useState(null);

  const actionType = isEditor ? FormEditorTypes.SUBMIT_FORM : FormEditorTypes.VIEW_INSPECTION;

  const onCloseSignatureModal = () => {
    setSignatureVisible(false);
  };

  const onSignNow = async (names) => {
    const totalScore = calculateTotalScore(formVal.formPages);
    setSignatureVisible(false);
    navigation.navigate('surveySignature', {
      totalScore: LocaleConfig.formatNumber(totalScore),
      names,
      onPressSubmit: (files) => createUserAnswer(formVal, files),
    });
  };

  const submitSurvey = () => {
    formRef.current.handleSubmit(onSubmit)();
  };

  const onLeftPress = () => {
    navigation.goBack();
  };

  const onSkipSignature = () => {
    setSignatureVisible(false);
    createUserAnswer(formVal);
  };

  // submit inspection
  const onSubmit = (values) => {
    setFormVal(values);
    setSignatureVisible(true);
  };

  const createUserAnswer = async (values, files = []) => {
    const body = {
      formId: survey.formId,
      parentId: survey.surveyId,
      moduleId: Modules.SURVEY,
      answers: transformAnswerData(values),
    };
    const result = await addUserAnswer(body);
    if (result) {
      if (files.length > 0) {
        uploadSurveySignature({
          referenceId: result.guid,
          files,
        });
      }
      navigation.goBack();
      DeviceEventEmitter.emit('EmployeeSurveyUpdated');
    }
  };

  const addOnButton = isEditor && {
    title: I18n.t('SURVEY_SUBMIT'),
    type: 'primary',
    onPress: submitSurvey,
  };

  return (
    <View style={{ flex: 1 }}>
      <FormEditorScreen
        formRef={formRef}
        validationSchema={validationSchema}
        title={I18n.t('SURVEY_MODULE_TITLE')}
        navigation={navigation}
        isLoading={isLoading}
        actionType={actionType}
        addOnButton={addOnButton}
        customLeftPress={onLeftPress}
      />
      <EnterNameSignatureModal
        visible={signatureVisible}
        onClosePress={onCloseSignatureModal}
        onSkip={onSkipSignature}
        onSignNow={onSignNow}
      />
    </View>
  );
};

export default EmployeeSurveyDetail;
