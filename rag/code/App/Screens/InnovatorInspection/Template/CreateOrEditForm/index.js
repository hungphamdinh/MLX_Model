import React, { Fragment } from 'react';
import I18n from '@I18n';

import _ from 'lodash';
import { DeviceEventEmitter } from 'react-native';
import * as Yup from 'yup';
import toast from '../../../../Utils/toast';
import useForm from '../../../../Context/Form/Hooks/UseForm';
import { FormDropdown, FormInput, FormCheckBox } from '../../../../Components/Forms';
import { FormEditorTypes } from '../../../../Config/Constants';
import FormEditorScreen from '../FormEditorScreen';
import Row from '../../../../Components/Grid/Row';
import ButtonHint from '../../../../Elements/ButtonHint';
import { AlertNative } from '../../../../Components';

const CreateOrEditForm = ({ navigation }) => {
  const routeName = _.get(navigation, 'state.routeName');
  const createInspection = navigation.getParam('createInspection');

  const formRef = React.useRef();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(I18n.t('FORM_THIS_FIELD_IS_REQUIRED')),
    formCategoryId: Yup.number()
      .min(1, I18n.t('FORM_THIS_FIELD_IS_REQUIRED'))
      .required(I18n.t('FORM_THIS_FIELD_IS_REQUIRED')),
  });
  const isAddNew = routeName === 'addForm';
  // case 'formEditor':
  //       action = ;
  //       setTitle(I18n.t('FORM_ADD_EDIT'));
  //       break;
  //     case 'inspectionDetail':
  //       action = FormEditorTypes.INSPECTION;
  //       setTitle(I18n.t('INSPECTION'));
  //       break;
  const {
    form: { formDetail, formCategories },
    createOrEditForm,
    publicForm,
    setFormToNonEdit,
  } = useForm();
  let actionType = FormEditorTypes.VIEW_FORM;
  let title = I18n.t('FORM_DETAIL');
  if (routeName === 'addForm') {
    title = I18n.t('FORM_ADD');
    actionType = FormEditorTypes.CREATE_EDIT_FORM;
  }
  if (routeName === 'updateForm') {
    title = I18n.t('FORM_UPDATE');
    actionType = FormEditorTypes.CREATE_EDIT_FORM;
  }

  const isAllowNonEditable = isAddNew || !formDetail?.isReadOnly;

  const checkNonEditableForm = (callBack) => {
    AlertNative(
      I18n.t('AD_COMMON_CONFIRMATION'),
      I18n.t('FORM_NON_EDITABLE_ASK'),
      callBack,
      I18n.t('AD_COMMON_YES'),
      I18n.t('AD_COMMON_CANCEL')
    );
  };

  const checkToSubmitNonEditable = (values) => values.isReadOnly && (!formDetail.isReadOnly || isAddNew);

  const onSubmit = async (values) => {
    if (checkToSubmitNonEditable(values)) {
      checkNonEditableForm(() => submitRequest(values));
      return;
    }
    submitRequest(values);
  };

  const submitRequest = async (values) => {
    const formId = await createOrEditForm(values, isAddNew ? null : formDetail);
    if (formId) {
      if (createInspection) {
        const params = {
          formId,
          isPublic: true,
        };
        const publicResult = await publicForm(params);
        if (publicResult) {
          navigation.goBack();
          createInspection(publicResult);
        }
        return;
      }
      if (checkToSubmitNonEditable(values)) {
        await setFormToNonEdit(formId);
      }
      handleResponseResult(values);
    }
  };

  const handleResponseResult = (values) => {
    navigation.goBack();
    setTimeout(() => {
      DeviceEventEmitter.emit('AddOrEditFormSuccess');
    }, 1000);
    if (!isAddNew) {
      // is update
      toast.showSuccess(`${values.name} ${I18n.t('FORM_UPDATED_SUCCESSULLY')}`);
      return;
    }
    toast.showSuccess(`${values.name} ${I18n.t('FORM_CREATED_SUCCESSULLY')}`);
  };

  const getInitialValuesForUpdate = () => {
    if (isAddNew) {
      return {};
    }

    return formDetail;
  };

  return (
    <FormEditorScreen
      formRef={formRef}
      validationSchema={validationSchema}
      actionType={actionType}
      title={title}
      navigation={navigation}
      onSubmit={onSubmit}
      addOnButton={
        actionType !== FormEditorTypes.VIEW_FORM && {
          title: 'Save',
          type: 'primary',
          onPress: () => {
            formRef.current.handleSubmit(onSubmit)();
          },
        }
      }
      addOnInputFields={
        <Fragment>
          <FormInput
            label="FORM_NAME"
            maxLength={200}
            required
            name="name"
            mode="small"
            editable={actionType !== FormEditorTypes.VIEW_FORM}
          />
          <FormDropdown
            label="FORM_CATEGORY"
            placeholder=""
            name="formCategoryId"
            required
            mode="small"
            options={formCategories}
            disabled={actionType === FormEditorTypes.VIEW_FORM}
          />
          <Row center>
            <FormCheckBox disabled={!isAllowNonEditable} label="FORM_NON_EDITABLE_CHECK_BOX" name="isReadOnly" />
            <ButtonHint content="FORM_NON_EDITABLE_HINT" />
          </Row>
        </Fragment>
      }
      initialValues={{
        name: '',
        description: '',
        formCategoryId: undefined,
        isPublish: false,
        formPages: [],
        isReadOnly: false,
        ...getInitialValuesForUpdate(),
      }}
    />
  );
};

export default CreateOrEditForm;
