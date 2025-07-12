import React, { useEffect } from 'react';
import I18n from '@I18n';
import { FormProvider } from 'react-hook-form';
import _ from 'lodash';
import * as Yup from 'yup';
import useForm from '../../../../Context/Form/Hooks/UseForm';
import { FormInput, FormLazyDropdown } from '../../../../Components/Forms';
import useProperty from '../../../../Context/Property/Hooks/UseProperty';
import BaseLayout from '../../../../Components/Layout/BaseLayout';
import { Card } from '../../../../Elements';
import useInspection from '../../../../Context/Inspection/Hooks/UseInspection';
import useUser from '../../../../Context/User/Hooks/UseUser';
import { useCompatibleForm, useYupValidationResolver } from '../../../../Utils/hook';

const CreateOrEditJob = ({ navigation }) => {
  const routeName = _.get(navigation, 'state.routeName');

  const validationSchema = Yup.object().shape({
    // name: Yup.string().required(I18n.t('FORM_THIS_FIELD_IS_REQUIRED')),
    propertyId: Yup.number()
      .min(1, I18n.t('FORM_THIS_FIELD_IS_REQUIRED'))
      .required(I18n.t('FORM_THIS_FIELD_IS_REQUIRED')),
    form: Yup.object().required(I18n.t('FORM_THIS_FIELD_IS_REQUIRED')),
  });
  const isAddNew = routeName === 'addJob';

  const {
    form: { formDetail, offlineForms },
    getOfflineForms,
  } = useForm();

  const {
    user: { user },
  } = useUser();

  const {
    inspection: { defaultStatus },
    createInspection,
  } = useInspection();
  const {
    getOfflineProperties,
    property: { offlineProperties },
  } = useProperty();

  const getList = (page = 1, keyword, isProperty = true) => {
    const getData = isProperty ? getOfflineProperties : getOfflineForms;
    getData(
      {
        page,
        keyword,
      },
      user.id
    );
  };

  useEffect(() => {
    getList();
    getList(1, '', false);
  }, []);

  const onSubmit = ({ propertyId, form }) => {
    // console.log(form);
    createInspection({
      propertyId,
      form,
      defaultStatus,
      user,
    });
  };

  const getInitialValuesForUpdate = () => {
    if (isAddNew) {
      return {};
    }

    return formDetail;
  };
  const mainLayoutProps = {
    title: isAddNew ? I18n.t('INSPECTION_ADD_JOB') : I18n.t('FORM_DETAIL'),
    bottomButtons: [
      {
        title: I18n.t('AD_COMMON_SAVE'),
        type: 'primary',
        permission: !isAddNew && 'WorkOrders.WorkOrder.Update',
        onPress: () => {
          formMethods.handleSubmit(onSubmit)();
        },
      },
    ],
  };

  const formMethods = useCompatibleForm({
    resolver: useYupValidationResolver(validationSchema),
    defaultValues: {
      name: '',
      description: '',
      isPublish: false,
      formPages: [],
      propertyId: '',
      form: '',
      ...getInitialValuesForUpdate(),
    },
  });

  const { watch } = formMethods;
  const form = watch('form');
  return (
    <BaseLayout {...mainLayoutProps}>
      <FormProvider {...formMethods}>
        <Card>
          {/* <FormInput label="INSPECTION_JOB_NAME" maxLength={200} name="name" mode="small" /> */}
          <FormLazyDropdown
            listExist={offlineProperties.data}
            isDropdownItem
            mode="small"
            showSearchBar
            getList={(page, key) => getList(page, key)}
            options={offlineProperties}
            title="INSPECTION_PROPERTY"
            label="INSPECTION_PROPERTY"
            fieldName="name"
            titleKey="name"
            name="propertyId"
          />
          <FormLazyDropdown
            listExist={offlineForms.data}
            isDropdownItem
            showValueByKey={false}
            mode="small"
            showSearchBar
            getList={(page, key) => getList(page, key, false)}
            options={offlineForms}
            title="FORM_NAME"
            label="FORM_NAME"
            fieldName="formName"
            titleKey="formName"
            name="form"
          />
          {form?.categoryName ? (
            <FormInput
              autoHeight
              maxLength={200}
              editable={false}
              value={form?.categoryName}
              label="FORM_CATEGORY"
              mode="small"
            />
          ) : null}
        </Card>
      </FormProvider>
    </BaseLayout>
  );
};

export default CreateOrEditJob;
