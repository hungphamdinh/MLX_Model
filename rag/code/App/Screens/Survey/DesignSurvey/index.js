import React from 'react';
import I18n from '@I18n';

import { DeviceEventEmitter } from 'react-native';
import toast from '../../../Utils/toast';
import useForm from '../../../Context/Form/Hooks/UseForm';
import { FormEditorTypes } from '../../../Config/Constants';
import FormEditorScreen from '../../InnovatorInspection/Template/FormEditorScreen';

const DesignSurvey = ({ navigation }) => {
  const formRef = React.useRef();

  const {
    form: { formDetail },
    createOrEditForm,
  } = useForm();
  const actionType = FormEditorTypes.CREATE_EDIT_FORM;

  const onSubmit = (values) => {
    const result = createOrEditForm(values, formDetail);
    if (result) {
      navigation.goBack();
      setTimeout(() => {
        DeviceEventEmitter.emit('AddOrEditFormSuccess');
      }, 1000);

      toast.showSuccess(`${values.name} ${I18n.t('FORM_UPDATED_SUCCESSULLY')}`);
    }
  };

  const getInitialValuesForUpdate = () => formDetail;

  return (
    <FormEditorScreen
      formRef={formRef}
      actionType={actionType}
      title={I18n.t('SURVEY_FORM_DESIGN')}
      navigation={navigation}
      addOnButton={{
        title: 'Save',
        type: 'primary',
        onPress: () => {
          formRef.current.handleSubmit(onSubmit)();
        },
      }}
      initialValues={{
        description: '',
        isPublish: false,
        formPages: [],
        ...getInitialValuesForUpdate(),
      }}
    />
  );
};

export default DesignSurvey;
